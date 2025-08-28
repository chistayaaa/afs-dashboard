import { makeObservable, observable, action, computed } from "mobx";
import { getCompany } from "../services/companies/get-company-info";
import { getContact } from "../services/contacts/get-contact-info";
import { Company, Contact } from "../types/types";
import { editCompany } from "../services/companies/update-company-info";
import { editContact } from "../services/contacts/update-contact-info";
import { uploadImage } from "../services/companies/add-company-image";
import { deleteImage } from "../services/companies/delete-company-image";
import { deleteCompany } from "../services/companies/delete-company";

export class OrganizationStore {
  @observable currentCompanyId: string | null = null;
  @observable company: Company | null = null;
  @observable contact: Contact | null = null;
  @observable photos: {
    name: string;
    filepath: string;
    thumbpath: string;
    createdAt: string;
  }[] = [];
  @observable companies: Company[] = [];
  @observable isLoading = false;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @computed get hasCompanyData() {
    return (
      this.company !== null && this.contact !== null && this.photos.length > 0
    );
  }

  @action
  async loadCompany(id: string) {
    if (this.currentCompanyId === id && this.hasCompanyData) {
      return; // Data already loaded for this ID
    }

    this.currentCompanyId = id;
    this.isLoading = true;
    this.error = null;

    try {
      this.company = await getCompany(id);
      this.contact = await getContact(this.company.contactId);
      this.photos = this.company.photos || [];
    } catch (err: any) {
      this.error = `Failed to load company ${id}: ${err.message}`;
      this.company = null;
      this.contact = null;
      this.photos = [];
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async loadCompanies(dontLoad = false) {
    if (dontLoad) return;
    this.isLoading = true;
    this.error = null;
    try {
      // For now, load just one company (ID '12')
      const company = await getCompany("12");
      this.companies = [company]; // Store as a single-item array
    } catch (err: any) {
      this.error = `Failed to load companies: ${err.message}`;
      this.companies = [];
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async updateCompany(newData: Partial<Company>) {
    try {
      if (this.company) {
        const updated = await editCompany(this.company.id, newData);
        this.company = { ...this.company, ...updated };
      }
    } catch (err: any) {
      this.error = `Failed to update company details: ${err.message}`;
    }
  }

  @action
  async updateContact(newData: Partial<Contact>) {
    this.isLoading = true;
    try {
      if (this.contact) {
        const updated = await editContact(this.contact.id, newData);
        this.contact = { ...this.contact, ...updated };
      }
    } catch (err: any) {
      this.error = `Failed to update contact details: ${err.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async addPhoto(file: File) {
    this.error = null;
    try {
      if (this.company && this.company.id) {
        const response = await uploadImage(this.company.id, file);
        const newPhoto = response;
        this.photos = [...this.photos, newPhoto];
        this.company = { ...this.company, photos: this.photos };
      }
    } catch (err: any) {
      this.error = `Failed to add photo: ${err.message}`;
    }
  }

  @action
  async deletePhoto(imageName: string) {
    this.error = null;
    try {
      if (this.company && this.company.id) {
        await deleteImage(this.company.id, imageName);
        this.photos = this.photos.filter((photo) => photo.name !== imageName);
        this.company = { ...this.company, photos: this.photos };
      }
    } catch (err: any) {
      this.error = `Failed to delete photo: ${err.message}`;
    }
  }

  @action
  async handleDeleteCompany() {
    this.isLoading = true;
    this.error = null;
    try {
      if (this.company && this.company.id) {
        await deleteCompany(this.company.id);
        this.companies = this.companies.filter(
          (item) => item.id !== this.company?.id
        );
        console.log(this.companies, "companies");
        this.clearCompany();
      }
    } catch (err: any) {
      this.error = `Failed to delete company: ${err.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  clearCompany() {
    this.currentCompanyId = null;
    this.company = null;
    this.contact = null;
    this.photos = [];
    this.error = null;
  }
}

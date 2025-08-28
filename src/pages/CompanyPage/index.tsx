import { observer } from "mobx-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  clientFieldsForm,
  companyFieldsForm,
  companyInfoItems,
  contactInfoItems,
} from "../../data/constants";
import {
  formatDate,
  formatPhoneNumber,
  formatType,
  getChangedFields,
} from "../../utils/helpers";
import { Company, Contact } from "../../types/types";
import { useStores } from "../../stores";

import "./styles.scss";

import CompanyEditForm from "../../components/molecules/CompanyEditForm";
import ViewSection from "../../components/molecules/ViewSection";
import ImageItem from "../../components/atoms/ImageItem";
import Modal from "../../components/organisms/Modal";

import { ReactComponent as EditIcon } from "../../assets/images/svg/Edit.svg";
import { ReactComponent as ChevronIcon } from "../../assets/images/svg/Chevron.svg";
import { ReactComponent as TrashIcon } from "../../assets/images/svg/Trash.svg";

const CompanyPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { organizationStore } = useStores();

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedCompany, setEditedCompany] = useState(organizationStore.company);
  const [editedContact, setEditedContact] = useState(organizationStore.contact);
  const [editedPhotos, setEditedPhotos] = useState(organizationStore.photos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const companyFormRef = useRef<{ setLoading: (loading: boolean) => void }>(
    null
  );
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const companyNameInputRef = useRef<HTMLInputElement>(null);
  const contactFormRef = useRef<{ setLoading: (loading: boolean) => void }>(
    null
  );
  const modalRef = useRef<{ setLoading: (loading: boolean) => void }>(null);

  useEffect(() => {
    if (id) {
      organizationStore.loadCompany(id);
    }
  }, [id, organizationStore]);

  useEffect(() => {
    setEditedCompany(organizationStore.company);
    setEditedContact(organizationStore.contact);
    setEditedPhotos(organizationStore.photos);
  }, [
    organizationStore.company,
    organizationStore.contact,
    organizationStore.photos,
  ]);

  /* methods */
  const handleSaveCompany = async (data: Company) => {
    if (companyFormRef.current) {
      companyFormRef.current.setLoading(true);
    }
    try {
      if (
        id &&
        JSON.stringify(data) !== JSON.stringify(organizationStore.company)
      ) {
        const changes = getChangedFields(data, organizationStore.company);

        if (Object.keys(changes).length > 0) {
          await organizationStore.updateCompany(changes);
          setIsEditingCompany(false);
        }
      }
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      if (companyFormRef.current) {
        companyFormRef.current.setLoading(false);
      }
    }
  };

  const handleSaveContact = async (data: Contact) => {
    if (contactFormRef.current) {
      contactFormRef.current.setLoading(true);
    }
    try {
      if (
        id &&
        JSON.stringify(data) !== JSON.stringify(organizationStore.contact)
      ) {
        const changes = getChangedFields(data, organizationStore.contact);

        if (Object.keys(changes).length > 0) {
          await organizationStore.updateContact(changes);
          setIsEditingContact(false);
        }
      }
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      if (contactFormRef.current) {
        contactFormRef.current.setLoading(false);
      }
    }
  };

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await organizationStore.addPhoto(file);
        setEditedPhotos(organizationStore.photos);
      } catch (error) {
        console.error("Error adding image:", error);
      } finally {
        event.target.value = "";
      }
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      await organizationStore.deletePhoto(imageName);
      setEditedPhotos(organizationStore.photos);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleModalAccept = async () => {
    if (modalRef.current) {
      modalRef.current.setLoading(true);
    }

    if (modalType === "edit" && organizationStore.company && id) {
      const newName = companyNameInputRef?.current?.value;
      if (newName !== organizationStore.company.name) {
        await organizationStore.updateCompany({ name: newName });
        setIsModalOpen(false);
      }
    } else if (modalType === "delete" && organizationStore.company && id) {
      await organizationStore.handleDeleteCompany();
      setIsModalOpen(false);
      navigate("/companies?delete-test");
    }
    if (modalRef.current) {
      modalRef.current.setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  /* renders */
  if (organizationStore.isLoading)
    return (
      <div className="page-company">
        <div className="empty-state">
          <h3 className="empty-state__title">Loading</h3>
        </div>
      </div>
    );
  if (organizationStore.error)
    return (
      <div className="page-company">
        <div className="empty-state">
          <h3 className="empty-state__title">
            Error: {organizationStore.error}
          </h3>
        </div>
      </div>
    );
  if (
    !organizationStore.company ||
    !organizationStore.contact ||
    !editedCompany
  )
    return (
      <div className="page-company">
        <div className="empty-state">
          <h3 className="empty-state__title">No data found</h3>
        </div>
      </div>
    );

  return (
    <div className="page-company">
      <Link
        to="/companies"
        className="btn btn__icon"
        style={{ margin: "4px 0" }}
      >
        <ChevronIcon width={20} height={20} />
      </Link>
      <div className="company__detail">
        <div className="company__header">
          <h4 className="page__title">{organizationStore.company.name}</h4>
          <div className="company__controls">
            <button
              className="btn btn__icon"
              onClick={() => {
                setModalType("edit");
                setIsModalOpen(true);
              }}
            >
              <EditIcon width={20} height={20} />
            </button>
            <button
              className="btn btn__icon btn__icon_red"
              onClick={() => {
                setModalType("delete");
                setIsModalOpen(true);
              }}
            >
              <TrashIcon width={20} height={20} />
            </button>
          </div>
        </div>
        <div className="company__info">
          <div className="company__info__card">
            {isEditingCompany ? (
              <CompanyEditForm
                ref={companyFormRef}
                initialData={editedCompany}
                title="Company Details"
                fields={companyFieldsForm}
                onSave={handleSaveCompany}
                onCancel={() => setIsEditingCompany(false)}
              />
            ) : (
              <ViewSection
                title="Company Details"
                onEdit={() => setIsEditingCompany(true)}
              >
                <div className="view__items">
                  {companyInfoItems.map((item) => {
                    let label = item?.label;
                    let description;

                    switch (true) {
                      case item.keys.includes("contract.no") ||
                        item.keys.includes("contract.issue_date"):
                        description = `${
                          editedCompany.contract.no
                        } <span className="gray">/</span> ${formatDate(
                          editedCompany.contract.issue_date
                        )}`;
                        break;
                      case item.keys.includes("businessEntity"):
                        description = `${editedCompany.businessEntity}`;
                        break;
                      case item.keys.includes("type"):
                        const formattedTypes = editedCompany.type.map(
                          (type: string) => formatType(type)
                        );

                        description = `${formattedTypes.join(", ")}`;
                        break;
                      default:
                        description = "";
                        break;
                    }

                    return (
                      description && (
                        <div
                          className="view-section__info"
                          key={item.label.trim()}
                        >
                          <h6>{label}</h6>
                          <p
                            dangerouslySetInnerHTML={{ __html: description }}
                          />
                        </div>
                      )
                    );
                  })}
                </div>
              </ViewSection>
            )}
          </div>

          <div className="company__info__card">
            {isEditingContact ? (
              <CompanyEditForm
                initialData={editedContact}
                ref={contactFormRef}
                title="Contacts"
                fields={clientFieldsForm}
                onSave={handleSaveContact}
                onCancel={() => setIsEditingContact(false)}
              />
            ) : editedContact ? (
              <ViewSection
                title="Contacts"
                onEdit={() => setIsEditingContact(true)}
              >
                <div className="view__items">
                  {contactInfoItems.map((item) => {
                    let label = item?.label;
                    let description;

                    switch (true) {
                      case item.keys.includes("firstname") ||
                        item.keys.includes("contract.issue_date"):
                        description = `${editedContact.firstname} ${editedContact.lastname}`;
                        break;
                      case item.keys.includes("phone"):
                        description = `${formatPhoneNumber(
                          editedContact.phone
                        )}`;
                        break;
                      case item.keys.includes("email"):
                        description = `${editedContact.email}`;
                        break;
                      default:
                        description = "";
                        break;
                    }

                    return (
                      description && (
                        <div
                          className="view-section__info"
                          key={item.label.trim()}
                        >
                          <h6>{label}</h6>
                          <p
                            dangerouslySetInnerHTML={{ __html: description }}
                          />
                        </div>
                      )
                    );
                  })}
                </div>
              </ViewSection>
            ) : null}
          </div>

          <div className="company__info__card">
            <ViewSection
              title="Photos"
              onAdd={() =>
                addImageInputRef && addImageInputRef?.current?.click()
              }
              type="add"
            >
              <div className="company__images-grid">
                {editedPhotos &&
                  editedPhotos.length > 0 &&
                  editedPhotos.map((item) => (
                    <ImageItem
                      key={item.name}
                      imageSrc={item.filepath}
                      imageAlt={item.name}
                      onDelete={() => handleDeleteImage(item.name)}
                    />
                  ))}
              </div>
            </ViewSection>
            {/* Hidden file input for image upload */}
            <input
              ref={addImageInputRef}
              type="file"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleAddImage}
              accept="image/*"
            />
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onDecline={handleModalClose}
          onAccept={handleModalAccept}
          ref={modalRef}
          extraClass={modalType === "edit" ? "" : "reduced-gap"}
          title={
            modalType === "edit"
              ? "Specify the Organization's name"
              : "Remove the Organization?"
          }
          acceptButtonLabel={
            modalType === "edit" ? "Save changes" : "Yes, remove"
          }
          declineButtonLabel={modalType === "edit" ? "Cancel" : "No"}
        >
          {modalType === "edit" && (
            <div className="modal__info">
              <input
                ref={companyNameInputRef}
                type="text"
                defaultValue={organizationStore.company?.name}
                className="modal-input"
              />
            </div>
          )}
          {modalType === "delete" && (
            <div className="modal__sub-label">
              Are you sure you want to remove this Organization?
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
});

export default CompanyPage;

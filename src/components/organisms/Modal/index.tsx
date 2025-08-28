import React, {
  ReactNode,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

interface ModalProps {
  isOpen: boolean;
  extraClass?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  acceptButtonLabel?: string;
  declineButtonLabel?: string;
  children: ReactNode;
  title?: string;
}

const Modal = forwardRef(
  (
    {
      isOpen,
      onAccept,
      onDecline,
      extraClass,
      children,
      title,
      acceptButtonLabel,
      declineButtonLabel,
    }: ModalProps,
    ref
  ) => {
    const [visible, setVisible] = useState(isOpen);
    const [exiting, setExiting] = useState(false);
    const [propsCache, setPropsCache] = useState<Omit<ModalProps, "isOpen">>({
      children,
      onAccept,
      onDecline,
      acceptButtonLabel,
      declineButtonLabel,
      extraClass,
      title,
    });

    const [loading, setLoading] = useState(false); 
    useImperativeHandle(ref, () => ({
      setLoading: (isLoading: boolean) => {
        setLoading(isLoading);
      },
    }));

    useEffect(() => {
      if (isOpen) {
        setPropsCache({
          children,
          onAccept,
          onDecline,
          extraClass,
          acceptButtonLabel,
          declineButtonLabel,
          title,
        });
      }
    }, [
      isOpen,
      children,
      extraClass,
      onAccept,
      onDecline,
      acceptButtonLabel,
      declineButtonLabel,
      title,
    ]);

    useEffect(() => {
      if (isOpen) {
        setVisible(true);
        setExiting(false);
      } else if (visible) {
        setExiting(true);
        const timer = setTimeout(() => {
          setVisible(false);
          setExiting(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [isOpen, visible]);

    if (!visible) return null;

    return ReactDOM.createPortal(
      <div
        className={`modal__overlay ${exiting ? "hidden" : ""}`}
        onClick={propsCache.onDecline}
      >
        <div
          className={`modal__content ${exiting ? "hidden" : ""} ${extraClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {propsCache.title && (
            <h2 className="modal__title">{propsCache.title}</h2>
          )}
          {propsCache.children}
          <div className="modal__actions">
            {propsCache.declineButtonLabel && (
              <button
                className="btn btn__regular btn_white"
                onClick={propsCache.onDecline}
              >
                {propsCache.declineButtonLabel}
              </button>
            )}
            {propsCache.acceptButtonLabel && (
              <button
                className="btn btn__regular btn_primary"
                onClick={propsCache.onAccept}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  <>{propsCache.acceptButtonLabel}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );
  }
);

export default Modal;

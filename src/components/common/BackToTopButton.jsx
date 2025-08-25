import { useState, useEffect } from "react";
import styles from "./backToTop.module.css";
import arrowIcon from "../../assets/footer/arrow-down.svg";

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          type="button"
          className={styles.button}
          onClick={scrollToTop}
          aria-label="맨 위로"
        >
          <img src={arrowIcon} alt="" className={styles.arrow} />
        </button>
      )}
    </>
  );
}

export default BackToTopButton;

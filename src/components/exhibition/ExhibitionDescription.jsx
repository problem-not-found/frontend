import styles from './exhibitionDescription.module.css';

const ExhibitionDescription = ({ 
  description = "이번 전시는 ---하다. 어떤 예술적 사조에 영향을 받았고, 어떤 것들을 통해 그런 감정을 전달하고자 했다. 이 전시를 감상할 때 ~한 점들을 생각하며 보면 더 재미있게 즐길 수 있을 것이다."
}) => {
  return (
    <div className={styles.descriptionSection}>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default ExhibitionDescription;

import styles from "./artworkDescription.module.css";

const ArtworkDescription = ({
  medium = "캔버스에 유화, 144x116",
  description = "이 작품은 파도를 나타냈다. 어떤 예술적 사조에 영향을 받았고, 어떤 것들을 통해 그런 감정을 전달하고자 했다. 이 전시를 감상할 때 ~한 점들을 생각하며 보면 더 재미있게 즐길 수 있을 것이다.",
}) => {
  // API 응답 데이터 확인을 위한 로그
  console.log("🎨 ArtworkDescription 받은 데이터:");
  console.log("medium:", medium);
  console.log("description:", description);
  console.log("description 타입:", typeof description);
  console.log("description 길이:", description?.length);
  console.log("\\n 포함 여부:", description?.includes("\n"));
  console.log("description JSON:", JSON.stringify(description));

  // \n으로 분할된 결과 확인
  if (description?.includes("\n")) {
    const lines = description.split("\n");
    console.log("📝 줄바꿈으로 분할된 결과:");
    lines.forEach((line, index) => {
      console.log(`  줄 ${index + 1}: "${line}"`);
    });
  }

  // \n을 <br> 태그로 변환하는 함수
  const formatDescription = (text) => {
    if (!text) return text;

    console.log("🔄 formatDescription 함수 실행:");
    console.log("  입력 텍스트:", text);

    const lines = text.split("\n");
    console.log("  분할된 줄 수:", lines.length);

    const result = lines.map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));

    return result;
  };

  return (
    <div className={styles.descriptionSection}>
      <div className={styles.descriptionContent}>
        <p className={styles.medium}>{medium}</p>
        <p className={styles.description}>{formatDescription(description)}</p>
      </div>
    </div>
  );
};

export default ArtworkDescription;

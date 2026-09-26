export const CATEGORIES = ["All", "Machine Learning", "Computer Vision", "Full-Stack", "Others"];
import srExamImage from "/assets/images/sr-exam.jpg";
import spec2priceImage from "/assets/images/spec2price.jpg";
import aslGestureRecognitionImage from "/assets/images/asl-gesture-recognition.jpg";
import fullStackProjectsImage from "/assets/images/full-stack-projects.jpg";
import cybersecurityContentImage from "/assets/images/cybersecurity-content.jpg";
import checkshopSentimentAnalysisImage from "/assets/images/checkshop-sentiment-analysis.jpg";

export const PROJECTS = [
  {
    title: "SR-Exam – Exam Management Platform",
    image: srExamImage,
    description:
      "Full-stack exam scheduling and proctoring system built with modern client-server architecture. Features automated allocation of students and proctors, real-time transaction management, cheating reporting, and file upload/download for exam materials. Built with a 5-person PKM-KC research team — contributed QA (13 test scenarios), documentation, and Scrum Master duties.",
    link: null,
    links: [
      { label: "GitHub", url: "https://github.com/Ajuleajul/SR-Exam" },
      { label: "Research Paper (PDF)", url: "/papers/sr-exam-pkm-kc-proposal.pdf" },
    ],
    category: "Full-Stack",
  },
  {
    title: "Spec2Price – Laptop Price Prediction",
    image: spec2priceImage,
    description:
      "Ensemble-based machine learning model (ExtraTrees + advanced feature engineering) that predicts continuous laptop prices in INR. Achieved Test R² of 0.9047 with optimized 20-feature subset via Lasso. Deployed as an interactive Streamlit application. Built with a 5-person research team (Group 16).",
    link: null,
    links: [
      { label: "Live App", url: "https://spec2price.streamlit.app/" },
      { label: "GitHub", url: "https://github.com/jasonsugianto/laptop-price-predictor" },
      { label: "Research Paper (PDF)", url: "/papers/spec2price-research-paper.pdf" },
    ],
    category: "Machine Learning",
  },
  {
    title: "Real-Time Hand Gesture Recognition (ASL)",
    image: aslGestureRecognitionImage,
    description:
      "Traditional machine learning pipeline combining HOG, LBP, and Hu Moments features with a linear SVM classifier. Recognizes 29 static ASL gestures (A–Z + space/delete/nothing) at 98.79% accuracy. Deployed as a real-time webcam web application running on CPU only. Built with a 5-person university research team.",
    link: null,
    links: [
      { label: "GitHub", url: "https://github.com/Ajuleajul/Real-Time-Hand-Gesture-Recognition" },
      { label: "Research Paper (PDF)", url: "/papers/asl-gesture-recognition-report.pdf" },
    ],
    category: "Computer Vision",
  },
  {
    title: "Personal Full-Stack Projects Collection",
    image: fullStackProjectsImage,
    description:
      "A series of independent full-stack and utility applications exploring modern web technologies, APIs, and practical problem-solving. Continuously updated repository of experiments and production-ready tools.",
    link: "https://github.com/Overols?tab=repositories",
    category: "Full-Stack",
  },
  {
    title: "Cybersecurity Content & Outreach Initiatives",
    image: cybersecurityContentImage,
    description:
      "One-year contribution as Media and Publication Activist for the Cyber Security Community. Produced educational content, campaign materials, and public awareness posts focused on digital security best practices.",
    link: null,
    links: [
      { label: "Post 01", url: "https://www.instagram.com/p/DONc_yGj3ok/" },
      { label: "Post 02", url: "https://www.instagram.com/p/DO-0Tx2DypU/" },
      { label: "Post 03", url: "https://www.instagram.com/p/DPLrgY4D_f9/" },
      { label: "Post 04", url: "https://www.instagram.com/p/DQoUNUAD8W2/" }, 
      { label: "Post 05", url: "https://www.instagram.com/p/DRPabrkDybi/" },
    ],
    category: "Others",
  },
  {
    title: "CheckShop – Sentiment Analysis of Online Shop Reviews",
    image: checkshopSentimentAnalysisImage,
    description:
      "Comparative NLP research benchmarking Logistic Regression, Naive Bayes, XGBoost, and a fine-tuned BERT model on 8,587 e-commerce reviews. BERT reached a 94.4% macro F1-score. Integrated into CheckShop, a Streamlit app giving sellers real-time multi-model sentiment predictions. Built with a 5-person university research team.",
    link: null,
    links: [
      { label: "Live App", url: "https://checkshopapplications.streamlit.app/" },
      { label: "GitHub", url: "https://github.com/RakhaZvy/CheckShop_APPLICATION.git" },
      { label: "Research Paper (PDF)", url: "/papers/checkshop-sentiment-analysis-report.pdf" },
    ],
    category: "Machine Learning",
  },
];
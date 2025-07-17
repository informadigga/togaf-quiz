// TOGAF Quiz Questions Pool
// 
// To add more questions to the quiz, simply add them to this array following the same format:
// {
//   question: "Your question text here?",
//   options: {
//     A: "Option A text",
//     B: "Option B text", 
//     C: "Option C text",
//     D: "Option D text",
//     E: "Option E text" (optional)
//   },
//   answer: "A" // The correct answer option
// }

// Import the JSON data and convert it to our format
import allQuestionsData from './all_questions.json';

// Convert the JSON data to our format
const convertedQuestions = allQuestionsData.map((q: any) => ({
  question: q.question,
  options: q.options,
  answer: q.answer
}));

export const togafQuestions = [
  // Original questions
  {
    question: "Which one of the following is the entry level certification for an individual wanting to be certified in the TOGAF Standard?",
    options: {
      A: "TOGAF® Enterprise Architecture Foundation",
      B: "TOGAF® Enterprise Architecture Practitioner",
      C: "TOGAF® Business Architecture Foundation",
      D: "TOGAF® Enterprise Architecture Level 1",
      E: "None of the above"
    },
    answer: "A"
  },
  {
    question: "Which one of the following is the entry level certification for an individual wanting to be certified in the TOGAF Standard?",
    options: {
      A: "TOGAF® Enterprise Architecture Foundation",
      B: "TOGAF® Enterprise Architecture Practitioner",
      C: "TOGAF® Business Architecture Foundation",
      D: "TOGAF® Enterprise Architecture Level 1",
      E: "None of the above"
    },
    answer: "A"
  },
  {
    question: "All of the following apply to the TOGAF Enterprise Architecture Part 1 Exam except which statement?",
    options: {
      A: "The exam consists of 60 questions",
      B: "It is a closed book examination",
      C: "Extra time, if English is 2nd language",
      D: "Pass mark is 60% min.",
      E: "The exam validates that the candidate has gained knowledge of the terminology and basic concepts of The TOGAF® Standard."
    },
    answer: "A"
  },
  {
    question: "Which one of the following is not an Architecture Domain of the Enterprise Architecture according to the TOGAF Standard?",
    options: {
      A: "Business Architecture",
      B: "Technology Architecture",
      C: "Data Architecture",
      D: "Application Architecture",
      E: "Organization Architecture"
    },
    answer: "E"
  },
  {
    question: "Which one of the following is not an Architecture Abstraction Level according to the TOGAF Standard?",
    options: {
      A: "Contextual Abstraction",
      B: "Physical Abstraction",
      C: "Strategic Abstraction",
      D: "Logical Abstraction",
      E: "Conceptual Abstraction"
    },
    answer: "C"
  },
  {
    question: "Which one of the following the TOGAF Standard defines as a representation of a system from the perspective of a related set of concerns?",
    options: {
      A: "Stakeholder",
      B: "Concern",
      C: "(Architecture) View",
      D: "(Architecture) Viewpoint",
      E: "Architecture Principle"
    },
    answer: "C"
  },
  {
    question: "Which one of the following the TOGAF Standard defines as a categorization model for classifying architecture and solution artifacts?",
    options: {
      A: "Architecture Principle",
      B: "Architecture Repository",
      C: "Enterprise Metamodel",
      D: "Enterprise Continuum",
      E: "Foundation Architecture"
    },
    answer: "D"
  },
  {
    question: "Which of the following the TOGAF Standard defines as a shortfall between Baseline and Target Architecture?",
    options: {
      A: "Constraint",
      B: "Deliverable",
      C: "Viewpoint",
      D: "Gap",
      E: "Concern"
    },
    answer: "D"
  },
  {
    question: "Which component of the Architecture Repository in the TOGAF Standard provides guidelines, templates, patterns and other forms of reference material?",
    options: {
      A: "Architecture Metamodel",
      B: "Solutions Landscape",
      C: "Reference Library",
      D: "Governance Repository",
      E: "Architecture Capability"
    },
    answer: "C"
  },
  {
    question: "Complete the sentence: In the TOGAF Standard, the Enterprise Continuum is...",
    options: {
      A: "...an Architecture Framework.",
      B: "...a database of open industry standards.",
      C: "...a technical reference model.",
      D: "...a method for developing architectures.",
      E: "...a model for classifying artifacts."
    },
    answer: "E"
  },
  {
    question: "Which one of the following the TOGAF Standard defines as an architectural work product that describes an aspect of the architecture?",
    options: {
      A: "Deliverable",
      B: "Artifact",
      C: "Architecture Building Block (ABB)",
      D: "Solution Building Block (SBB)",
      E: "Concern"
    },
    answer: "B"
  },
  {
    question: "Which one of the following is not a phase of the TOGAF Architecture Development Method (ADM)?",
    options: {
      A: "Preliminary Phase",
      B: "Phase F: Migration Planning",
      C: "Phase B: Business Architecture",
      D: "Phase G: Implementation Governance",
      E: "Phase C: Requirements Architecture"
    },
    answer: "E"
  },
  {
    question: "Which one of the TOGAF Architecture Development Method (ADM) phase includes the creation and approval of the Architecture Vision?",
    options: {
      A: "Preliminary Phase",
      B: "Requirements Management",
      C: "Phase A",
      D: "Phase B",
      E: "Phase C"
    },
    answer: "C"
  },
  {
    question: "Which one of the TOGAF Architecture Development Method (ADM) phase provides an architectural oversight of the implementation?",
    options: {
      A: "Phase H",
      B: "Phase E",
      C: "Phase G",
      D: "Requirements Management",
      E: "All of the above"
    },
    answer: "C"
  },
  {
    question: "Which one of the following is not part of the TOGAF Fundamental Content?",
    options: {
      A: "Architecture Content",
      B: "Introduction & Core Concepts",
      C: "ADM Techniques",
      D: "Enterprise Architecture Capability and Governance",
      E: "Security Architecture"
    },
    answer: "E"
  },
  {
    question: "Which one of the following best describes the need for an Enterprise Architecture?",
    options: {
      A: "Achieving a balance between business transformation and operational efficiency",
      B: "Optimizing across the enterprise the often fragmented legacy of processes into an integrated environment",
      C: "Providing a strategic context for the evolution and reach of digital capability in response to the constantly changing needs of the business environment",
      D: "Providing an integrated strategy which permits the closest possible synergies across the enterprise and beyond",
      E: "All of the above"
    },
    answer: "E"
  },
  {
    question: "Which one of the following statements does not correctly describe an architecture deliverable? According to the TOGAF Standard a deliverable...",
    options: {
      A: "...is an architectural work product.",
      B: "...is contractually specified.",
      C: "...represents the output of projects.",
      D: "...is defined to avoid tailoring the inputs and outputs of the ADM cycle.",
      E: "...is formally reviewed, agreed, and signed off by the stakeholders."
    },
    answer: "D"
  },
  {
    question: "What TOGAF Standard deliverable identifies changes that should be made to the architecture and considers their implications?",
    options: {
      A: "Request for Architecture Work",
      B: "Requirements Impact Assessment",
      C: "Architecture Roadmap",
      D: "Capability Assessment",
      E: "Change Request"
    },
    answer: "B"
  },
  {
    question: "Which one of the following the TOGAF Standard considers as an attribute of a good Building Block?",
    options: {
      A: "Considers implementation & usage",
      B: "Is re-usable and replaceable",
      C: "Has defined boundaries and specification",
      D: "Evolves to exploit technology & standards",
      E: "All of the above"
    },
    answer: "E"
  },
  {
    question: "Which one of the following the TOGAF Standard describes as the content of a Building Block (BB)?",
    options: {
      A: "Package of functionality",
      B: "Defined Implementation",
      C: "Products and components",
      D: "Coded application logic",
      E: "Agreed Service Level Agreement"
    },
    answer: "A"
  },
  {
    question: "According to the TOGAF Standard, (Architecture) Views and (Architecture) Viewpoints are used by an architect to capture or model the design of a system architecture. Which one of the following statements is true?",
    options: {
      A: "Every view has an associated viewpoint that describes it, at least implicitly",
      B: "A viewpoint is always specific to the architecture for which it is created",
      C: "Different stakeholders always share the same views",
      D: "Different stakeholders always share the same viewpoints"
    },
    answer: "A"
  },
  {
    question: "Stakeholders and their concerns are key concepts in the TOGAF Standard. Which one of the following statements is false?",
    options: {
      A: "A concern is an interest in a system relevant to one or more of its stakeholders",
      B: "A stakeholder is an individual, team, organization, or class thereof, having an interest in a system",
      C: "Identifying concerns helps ensure stakeholders' interests are addressed and requirements are identified",
      D: "Concerns should be SMART and have specific metrics."
    },
    answer: "D"
  },
  {
    question: "Which part of the TOGAF Fundamental Content contains a tested and repeatable process for developing an Enterprise Architectures?",
    options: {
      A: "Architecture Content",
      B: "ADM Techniques",
      C: "Architecture Development Method",
      D: "Introduction and Core Concepts",
      E: "(Architecture) Content Framework"
    },
    answer: "C"
  },
  {
    question: "Which one of the TOGAF Architecture Development Method (ADM) phase includes the creation of an Application and a Data Architecture?",
    options: {
      A: "Phase B: Business Architecture",
      B: "Phase C: Information Systems Architectures",
      C: "Phase D: Technology Architecture",
      D: "Preliminary Phase",
      E: "Phase G: Implementation Governance"
    },
    answer: "B"
  },
  {
    question: "Which one of the following the TOGAF Standard describes as an architectural work product that is contractually specified and formally reviewed, agreed, and signed off by the stakeholders.",
    options: {
      A: "Deliverable",
      B: "Artifact",
      C: "Building Block",
      D: "Catalog",
      E: "Matrix"
    },
    answer: "A"
  },
  {
    question: "According to the TOGAF Standard, in which Architecture Development Method (ADM) phase the initial implementation planning occur?",
    options: {
      A: "Phase A: Architecture Vision",
      B: "Phase B: Business Architecture",
      C: "Phase C: Information Systems Architectures",
      D: "Phase D: Technology Architecture",
      E: "Phase E: Opportunities and Solutions"
    },
    answer: "E"
  },
  {
    question: "Complete the sentence: According to the TOGAF Standard, the architectures that address the detailed needs and business requirements are known as...",
    options: {
      A: "Strategic Architectures",
      B: "Specific Architectures",
      C: "Specific Solutions",
      D: "Architecture Context and Requirements"
    },
    answer: "B"
  },
  {
    question: "According to the TOGAF Standard, which one of the following is described as a view on artifacts held in the Enterprise Repositories?",
    options: {
      A: "Governance Repository",
      B: "TOGAF Library",
      C: "Architecture Landscape",
      D: "Enterprise Continuum",
      E: "Governance Archive"
    },
    answer: "D"
  },
  {
    question: "Which one of the following describes a purpose of an (Architecture) Compliance Assessment within the TOGAF Standard?",
    options: {
      A: "Ensures that the design and implementation is in line with the strategic and architectural objectives and the Architecture Vision",
      B: "Define the capabilities of the organization",
      C: "Communicate technical readiness of the project",
      D: "Produce a new Request for Architecture Work"
    },
    answer: "A"
  },
  {
    question: "Which one of the following the TOGAF Standard considers as an essential aspect of Architecture Governance?",
    options: {
      A: "Conducting Business Scenarios",
      B: "Authoring the Communications Plan for a given architecture project",
      C: "Ensuring architecture compliance of projects",
      D: "Authoring the Architecture Definition Document"
    },
    answer: "C"
  },
  {
    question: "According to the TOGAF Standard, which one of the following best describes the reasons for the establishment of an Architecture Board?",
    options: {
      A: "Conduct source code design reviews",
      B: "Conduct performance appraisals on the Enterprise Architecture team",
      C: "Review and maintenance of the architecture and oversee the implementation of the strategy",
      D: "Ensure that new applications a introduced in a managed change process",
      E: "Facilitate the adoption of advanced information technology"
    },
    answer: "C"
  },
  // Add all the new questions from the JSON file
  ...convertedQuestions
];
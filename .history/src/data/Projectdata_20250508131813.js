const projectData = [
  {
    id: 1,
    forms: {
      projectNo: "PRJ-001",
      nameOfWork: "PFEPL Boomerang Office Expansion ",
      dateOfLoa: "2023-01-15",
      dateOfWorkOrder: "2023-02-01",
      startingDate: "2023-03-01",
      durationOfProject: "12 months",
      completionDate: "2024-03-01",
      actualDateOfCompletion: "2024-02-28",
      workOrderValue: "₹50,00,000",
      revisedWorkOrder: "₹52,00,000",
      remarks: "Office needed more Space for expansion",
      additionalSecurityDeposit: "₹5,00,000",
      asdActualReturnDate: "2024-04-01",
      asdPlannedReturnDate: "2024-03-15",
      psdBgFdrActualDate: "2024-03-20",
      asdBgFdrNo: "ASD12345",
      formOfAsd: "BG",
      asdBgFdrValidity: "2024-06-01",
      asdBgFdrStatus: "Not Returned",
      performanceSecurityDeposit: "₹10,00,000",
      psdBgFdrNo: "PSD67890",
      asdBgFdrIssuedInFavorOf: "Karthik",
      psdBgFdrReturnDate: "2024-05-01",
      formOfPsd: "FDR",
      psdBgFdrValidity: "2024-07-01",
      psdBgFdrStatus: "Not Returned",
      psdBgFdrIssuedInFavorOf: "Karthik",
      dateOfAmendment: "2023-12-01",
      dlpEndDate: "2025-03-01",
      workCompletionCertificateTaken: "Yes",
      defectsLiabilityPeriod: "12 months",
      attachments: [
        {
          name: 'logo.png',
          url: '/logo.png',
          type: 'image/png'
        },
        {
          name: 'profile-icon.png',
          url: '/profile-icon.png',
          type: 'image/png'
        },
        {
          name: 'Tender-data.xlsx',
          url: '/Tender-data.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ],
    },
    dates: [
      { completionNo: 1, date: "2024-03-01" },
      { completionNo: 2, date: "2024-03-15" }
    ],
    account: {
      summary: {
        cumulativeValueOfBills: "₹30,00,000",
        balanceValueOfContract: "₹20,00,000",
        revisedValueFromVariation: "₹2,00,000"
      },
      bills: [
        {
          raNumber: "RA1",
          date: "2023-06-01",
          billAmount: "₹10,00,000",
          cumulativeAmount: "₹10,00,000",
          workBreakdownStructure: "Earthwork and foundation"
        },
        {
          raNumber: "RA2",
          date: "2023-09-01",
          billAmount: "₹12,00,000",
          cumulativeAmount: "₹22,00,000",
          workBreakdownStructure: "Road surfacing"
        },
        {
          raNumber: "RA3",
          date: "2023-12-01",
          billAmount: "₹8,00,000",
          cumulativeAmount: "₹30,00,000",
          workBreakdownStructure: "Drainage system"
        }
      ]
    },
    expenses: [
      {
        raNumber: "RA1",
        date: "2023-06-15",
        billAmount: "₹2,00,000",
        cumulativeAmount: "₹2,00,000",
        workBreakdownStructure: "Material procurement"
      },
      {
        raNumber: "RA1",
        date: "2023-06-20",
        billAmount: "₹1,50,000",
        cumulativeAmount: "₹3,50,000",
        workBreakdownStructure: "Labor costs"
      },
      {
        raNumber: "RA2",
        date: "2023-09-10",
        billAmount: "₹3,00,000",
        cumulativeAmount: "₹3,00,000",
        workBreakdownStructure: "Equipment rental"
      },
      {
        raNumber: "RA2",
        date: "2023-09-15",
        billAmount: "₹2,50,000",
        cumulativeAmount: "₹5,50,000",
        workBreakdownStructure: "Transportation"
      },
      {
        raNumber: "RA3",
        date: "2023-12-05",
        billAmount: "₹1,80,000",
        cumulativeAmount: "₹1,80,000",
        workBreakdownStructure: "Utility expenses"
      }
    ],
    variations: [
      {
        previousValue: "₹50,00,000",
        addedValue: "₹1,00,000",
        updatedValue: "₹51,00,000"
      },
      {
        previousValue: "₹51,00,000",
        addedValue: "₹50,000",
        updatedValue: "₹51,50,000"
      },
      {
        previousValue: "₹51,50,000",
        addedValue: "₹50,000",
        updatedValue: "₹52,00,000"
      }
    ],
    notes: "Initial meeting with stakeholders on 2023-03-01 went well. Discussed expansion plans and finalized layout. Noted some concerns about parking space availability. Follow-up meeting scheduled for 2023-03-15 to review progress.",
    notesAttachments: [
      {
        name: "ReadME.txt",
        url: "/ReadME.txt",
        type: "text/plain"
      },
      {
        name: "Imp_notes.pdf",
        url: "/Imp_notes.pdf",
        type: "application/pdf"
      }
    ]
  },
  {
    id: 2,
    forms: {
      projectNo: "PRJ-002",
      nameOfWork: "Residential Building Construction with Modern Amenities",
      dateOfLoa: "2023-02-10",
      dateOfWorkOrder: "2023-03-01",
      startingDate: "2023-04-01",
      durationOfProject: "18 months",
      completionDate: "2024-10-01",
      actualDateOfCompletion: "2024-09-15",
      workOrderValue: "₹1,20,00,000",
      revisedWorkOrder: "₹1,25,00,000",
      remarks: "Ahead of schedule due to efficient resource management"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 3,
    forms: {
      projectNo: "PRJ-003",
      nameOfWork: "Bridge Reconstruction and Structural Reinforcement",
      dateOfLoa: "2023-03-05",
      dateOfWorkOrder: "2023-03-20",
      startingDate: "2023-04-15",
      durationOfProject: "24 months",
      completionDate: "2025-04-15",
      actualDateOfCompletion: "2025-04-10",
      workOrderValue: "₹2,00,00,000",
      revisedWorkOrder: "₹2,10,00,000",
      remarks: "Minor adjustments made to accommodate local traffic disruptions"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 4,
    forms: {
      projectNo: "PRJ-004",
      nameOfWork: "Solar Power Plant Installation with Advanced",
      dateOfLoa: "2023-04-01",
      dateOfWorkOrder: "2023-04-15",
      startingDate: "2023-05-01",
      durationOfProject: "10 months",
      completionDate: "2024-03-01",
      actualDateOfCompletion: "2024-02-25",
      workOrderValue: "₹80,00,000",
      revisedWorkOrder: "₹82,00,000",
      remarks: "Completed early thanks to streamlined procurement processes"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 5,
    forms: {
      projectNo: "PRJ-005",
      nameOfWork: "Water Treatment Plant Upgradation with State-of-the-Art",
      dateOfLoa: "2023-05-10",
      dateOfWorkOrder: "2023-05-25",
      startingDate: "2023-06-01",
      durationOfProject: "15 months",
      completionDate: "2024-09-01",
      actualDateOfCompletion: "2024-08-30",
      workOrderValue: "₹1,50,00,000",
      revisedWorkOrder: "₹1,55,00,000",
      remarks: "Minor budget overrun due to unforeseen equipment costs(basically ate a pizza)"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 6,
    forms: {
      projectNo: "PRJ-006",
      nameOfWork: "Railway Track Expansion and Electrification",
      dateOfLoa: "2023-06-01",
      dateOfWorkOrder: "2023-06-15",
      startingDate: "2023-07-01",
      durationOfProject: "20 months",
      completionDate: "2025-03-01",
      actualDateOfCompletion: "2025-02-28",
      workOrderValue: "₹3,00,00,000",
      revisedWorkOrder: "₹3,10,00,000",
      remarks: "Reviews ensuring compliance with safety and operational standards. Helll nooo"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 7,
    forms: {
      projectNo: "PRJ-007",
      nameOfWork: "Commercial Complex Development using GTA 6",
      dateOfLoa: "2023-07-01",
      dateOfWorkOrder: "2023-07-15",
      startingDate: "2023-08-01",
      durationOfProject: "24 months",
      completionDate: "2025-08-01",
      actualDateOfCompletion: "2025-07-25",
      workOrderValue: "₹2,50,00,000",
      revisedWorkOrder: "₹2,60,00,000",
      remarks: "Slightly ahead of schedule during construction phases. Fast Fast"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 8,
    forms: {
      projectNo: "PRJ-008",
      nameOfWork: "Airport Runway Upgrade with Enhanced Safety",
      dateOfLoa: "2023-08-01",
      dateOfWorkOrder: "2023-08-15",
      startingDate: "2023-09-01",
      durationOfProject: "18 months",
      completionDate: "2025-03-01",
      actualDateOfCompletion: "2025-02-20",
      workOrderValue: "₹4,00,00,000",
      revisedWorkOrder: "₹4,20,00,000",
      remarks: "Weather delays impacted timeline, Pilot dies amid Crash"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 9,
    forms: {
      projectNo: "PRJ-009",
      nameOfWork: "Industrial Warehouse Construction with Automated Storage and Retrieval Systems",
      dateOfLoa: "2023-09-01",
      dateOfWorkOrder: "2023-09-15",
      startingDate: "2023-10-01",
      durationOfProject: "12 months",
      completionDate: "2024-10-01",
      actualDateOfCompletion: "2024-09-28",
      workOrderValue: "₹90,00,000",
      revisedWorkOrder: "₹92,00,000",
      remarks: "Completed on time with all deliverables met"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 10,
    forms: {
      projectNo: "PRJ-010",
      nameOfWork: "Dam Repair and Structural Reinforcement Project ",
      dateOfLoa: "2023-10-01",
      dateOfWorkOrder: "2023-10-15",
      startingDate: "2023-11-01",
      durationOfProject: "14 months",
      completionDate: "2025-01-01",
      actualDateOfCompletion: "2024-12-30",
      workOrderValue: "₹1,80,00,000",
      revisedWorkOrder: "₹1,85,00,000",
      remarks: "Early completion achieved through optimized workflows"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 11,
    forms: {
      projectNo: "PRJ-011",
      nameOfWork: "School Building Renovation with Modern",
      dateOfLoa: "2023-11-01",
      dateOfWorkOrder: "2023-11-15",
      startingDate: "2023-12-01",
      durationOfProject: "10 months",
      completionDate: "2024-10-01",
      actualDateOfCompletion: "2024-09-20",
      workOrderValue: "₹70,00,000",
      revisedWorkOrder: "₹72,00,000",
      remarks: "Ahead of schedule with no major issues, ensuring readiness"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 12,
    forms: {
      projectNo: "PRJ-012",
      nameOfWork: "Wind Farm Installation with Advanced Turbine Technology",
      dateOfLoa: "2023-12-01",
      dateOfWorkOrder: "2023-12-15",
      startingDate: "2024-01-01",
      durationOfProject: "16 months",
      completionDate: "2025-05-01",
      actualDateOfCompletion: "2025-04-28",
      workOrderValue: "₹2,20,00,000",
      revisedWorkOrder: "₹2,25,00,000",
      remarks: "On track with regular inspections ensuring compliance"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 13,
    forms: {
      projectNo: "PRJ-013",
      nameOfWork: "Hospital Expansion with Specialized Medical Units",
      dateOfLoa: "2024-01-01",
      dateOfWorkOrder: "2024-01-15",
      startingDate: "2024-02-01",
      durationOfProject: "20 months",
      completionDate: "2025-10-01",
      actualDateOfCompletion: "2025-09-25",
      workOrderValue: "₹3,50,00,000",
      revisedWorkOrder: "₹3,60,00,000",
      remarks: "Minor delays due to regulatory approvals"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 14,
    forms: {
      projectNo: "PRJ-014",
      nameOfWork: "Sewage Treatment Plant Construction",
      dateOfLoa: "2024-02-01",
      dateOfWorkOrder: "2024-02-15",
      startingDate: "2024-03-01",
      durationOfProject: "12 months",
      completionDate: "2025-03-01",
      actualDateOfCompletion: "2025-02-28",
      workOrderValue: "₹1,00,00,000",
      revisedWorkOrder: "₹1,05,00,000",
      remarks: "Completed on time with all systems operational"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  },
  {
    id: 15,
    forms: {
      projectNo: "PRJ-015",
      nameOfWork: "Metro Station Construction with Integrated Public",
      dateOfLoa: "2024-03-01",
      dateOfWorkOrder: "2024-03-15",
      startingDate: "2024-04-01",
      durationOfProject: "24 months",
      completionDate: "2026-04-01",
      actualDateOfCompletion: "2026-03-30",
      workOrderValue: "₹5,00,00,000",
      revisedWorkOrder: "₹5,20,00,000",
      remarks: "On schedule with ongoing coordination with city authorities"
    },
    dates: [],
    account: {},
    expenses: [],
    variations: [],
    notes: "",
    notesAttachments: []
  }
];

export default projectData;
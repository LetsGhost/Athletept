import TemplateUtils from "../app/utils/templateUtils";

const mockCheckIn = {
  _id: {
    $oid: "656f6a7f7695a219bf6862d7",
  },
  checkInStatus: false,
  checkIn: {
    currentGrowth: {
      answer: "Ja habe ich",
      answer2: "Nö",
      _id: {
        $oid: "656f6a7f7695a219bf6862d9",
      },
    },
    problems: {
      answer: "Nee gibt keine",
      boolean: true,
      _id: {
        $oid: "656f6a7f7695a219bf6862da",
      },
    },
    regeneration: {
      _id: {
        $oid: "656f6a7f7695a219bf6862db",
      },
    },
    change: {
      answer: "Nee",
      boolean: true,
      _id: {
        $oid: "656f6a7f7695a219bf6862dc",
      },
    },
    weight: {
      weight: 50,
      _id: {
        $oid: "656f6a7f7695a219bf6862dd",
      },
    },
    _id: {
      $oid: "656f6a7f7695a219bf6862d8",
    },
  },
  createdAt: {
    $date: "2023-12-05T18:22:55.742Z",
  },
  __v: 0,
};

const mockProtocol = {
  _id: {
    $oid: "659d80a30a0859f7248aea28",
  },
  exerciseDays: [
    {
      dayNumber: 1,
      type: "Push",
      comment: {
        Scale: 9,
        Notes: "",
        _id: {
          $oid: "659d80a30a0859f7248aea2a",
        },
      },
      exercises: [
        {
          Exercises: "Bankdrücken",
          Weight: "12/12",
          Repetitions: "12/12",
          _id: {
            $oid: "659d80a30a0859f7248aea2b",
          },
        },
      ],
      _id: {
        $oid: "659d80a30a0859f7248aea29",
      },
    },
    {
      dayNumber: 2,
      type: "Pull",
      comment: {
        Scale: 9,
        Notes: "",
        _id: {
          $oid: "659da1580a0859f7248aeae5",
        },
      },
      exercises: [
        {
          Exercises: "Klimmzug",
          Weight: "12",
          Repetitions: "12",
          _id: {
            $oid: "659da1580a0859f7248aeae6",
          },
        },
      ],
      _id: {
        $oid: "659da1580a0859f7248aeae4",
      },
    },
    {
      dayNumber: 3,
      type: "Oberkörper",
      comment: {
        Scale: 8,
        Notes: "",
        _id: {
          $oid: "65a177f30a0859f7248aed39",
        },
      },
      exercises: [
        {
          Exercises: "Schrägbankdrücken",
          Weight: "30/30/30",
          Repetitions: "12/11/10",
          _id: {
            $oid: "65a177f30a0859f7248aed3a",
          },
        },
        {
          Exercises: "Latzug",
          Weight: "49.5/49.5/49.5",
          Repetitions: "12/10/8",
          _id: {
            $oid: "65a177f30a0859f7248aed3b",
          },
        },
        {
          Exercises: "PecFlys",
          Weight: "18/22.5/22.5",
          Repetitions: "12/12/10",
          _id: {
            $oid: "65a177f30a0859f7248aed3c",
          },
        },
        {
          Exercises: "T-Bar Rudern",
          Weight: "20/25/25",
          Repetitions: "12/12/12",
          _id: {
            $oid: "65a177f30a0859f7248aed3d",
          },
        },
        {
          Exercises: "Seitheben",
          Weight: "7.5/10/10",
          Repetitions: "12/12/12",
          _id: {
            $oid: "65a177f30a0859f7248aed3e",
          },
        },
      ],
      _id: {
        $oid: "65a177f30a0859f7248aed38",
      },
    },
  ],
  createdAt: {
    $date: "2024-01-09T17:21:39.114Z",
  },
  __v: 2,
};

const mockBlankProtocol = {
  _id: {
    $oid: "658b161c3f7bd66c77c1f5b5",
  },
  exerciseDays: [
    {
      _id: {
        $oid: "658b161c3f7bd66c77c1f598",
      },
      exercises: [],
    },
    {
      dayNumber: 1,
      type: "Push",
      comment: {
        Scale: 0,
        Notes: "",
        _id: {
          $oid: "658b16273f7bd66c77c1f65f",
        },
      },
      exercises: [
        {
          Exercises: "Schrägbankdrücken",
          Weight: "30/30/30",
          Repetitions: "12/11/10",
          _id: {
            $oid: "65a177f30a0859f7248aed3a",
          },
        },
        {
          Exercises: "Latzug",
          Weight: "49.5/49.5/49.5",
          Repetitions: "12/10/8",
          _id: {
            $oid: "65a177f30a0859f7248aed3b",
          },
        },
      ],
      _id: {
        $oid: "658b16273f7bd66c77c1f65e",
      },
    },
    {
      dayNumber: 3,
      type: "Oberkörper",
      comment: {
        Scale: 0,
        Notes: "",
        _id: {
          $oid: "658c6e903f7bd66c77c1fc70",
        },
      },
      exercises: [],
      _id: {
        $oid: "658c6e903f7bd66c77c1fc6f",
      },
    },
  ],
  createdAt: {
    $date: "2023-12-26T18:06:20.272Z",
  },
  __v: 2,
};

describe("TemplateUtils", () => {
  describe("render Template for CheckIn", () => {
    it("should return a rendered HTML", async () => {
      const template = TemplateUtils.renderTemplateWithData(
        "checkIn.ejs",
        {checkIn: mockCheckIn}
      );
      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });
  
  describe("render Template Protocol", () => {
    it("should return a rendered HTML", async () => {
      const template = TemplateUtils.renderTemplateWithData(
        "protocol.ejs",
        {protocolExercisePlan: mockProtocol}
      );

      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });

  describe("render Template Protocol with blank Protocol", () => {
    it("should return a rendered HTML", async () => {
      const template = TemplateUtils.renderTemplateWithData(
        "protocol.ejs",
        {protocolExercisePlan: mockBlankProtocol}
      );
      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });
});

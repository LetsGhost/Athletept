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
    $oid: "655fa0f7725fe14433b88209",
  },
  exerciseDays: [
    {
      dayNumber: 1,
      type: "Oberkörper",
      comment: {
        Scale: 5,
        Notes: "Bankdrücken war blöd",
        _id: {
          $oid: "655fa0f7725fe14433b8820b",
        },
      },
      exercises: [
        {
          Exercises: "Flys",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0f7725fe14433b8820c",
          },
        },
        {
          Exercises: "Squads",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0f7725fe14433b8820d",
          },
        },
        {
          Exercises: "Bankdrücken",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0f7725fe14433b8820e",
          },
        },
      ],
      _id: {
        $oid: "655fa0f7725fe14433b8820a",
      },
    },
    {
      dayNumber: 2,
      type: "Oberkörper",
      comment: {
        Scale: 5,
        Notes: "Bankdrücken war blöd",
        _id: {
          $oid: "655fa0fb725fe14433b88234",
        },
      },
      exercises: [
        {
          Exercises: "Flys",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0fb725fe14433b88235",
          },
        },
        {
          Exercises: "Squads",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0fb725fe14433b88236",
          },
        },
        {
          Exercises: "Bankdrücken",
          Weight: "20/40/50",
          Repetitions: "50/20/80",
          _id: {
            $oid: "655fa0fb725fe14433b88237",
          },
        },
      ],
      _id: {
        $oid: "655fa0fb725fe14433b88233",
      },
    },
  ],
  createdAt: {
    $date: "2023-11-23T18:59:03.402Z",
  },
  __v: 1,
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
      exercises: [],
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
        mockCheckIn
      );
      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });
  describe("render Template Protocol", () => {
    it("should return a rendered HTML", async () => {
      const template = TemplateUtils.renderTemplateWithData(
        "protocol.ejs",
        mockProtocol
      );
      console.log(template);
      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });

  describe("render Template Protocol with blank Protocol", () => {
    it("should return a rendered HTML", async () => {
      const template = TemplateUtils.renderTemplateWithData(
        "protocol.ejs",
        mockBlankProtocol
      );
      expect(template).toBeDefined();
      expect(template).not.toBe(""); // Add this line
    });
  });
});

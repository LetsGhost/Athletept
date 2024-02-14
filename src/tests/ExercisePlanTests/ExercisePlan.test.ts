import { createExercisePlan, createWarmup } from '../../app/utils/exercisePlanUtils';


describe('ExercisPlanService', () => {
  describe('createExerciseplan and check if the set rules are working', () => {

    it('create an exerciseplan that that throws an error with the new rules', async () => {
      const exercisPlanPath = "src/tests/Trainingstabelle_Vorlage.xlsx"
      const warmupExercisePath = "src/tests/warmuptabelle_for_testing.xlsx"

      const result1 = await createExercisePlan(exercisPlanPath);
      const result2 = await createWarmup(result1?.exercisePlan, warmupExercisePath);

      expect(result1?.success).toEqual(true);
      expect(result2?.success).toEqual(true);
  })

  });
})
import { ReputationScores } from '../types';

export const reputationScorer = {
  getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  },

  getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return '#00ffcc'; // Greenish cyan
    if (grade.startsWith('B')) return '#77ff00'; // Lime
    if (grade.startsWith('C')) return '#ffcc00'; // Yellow
    if (grade.startsWith('D')) return '#ff7700'; // Orange
    return '#ff0055'; // Red
  }
};

export default reputationScorer;

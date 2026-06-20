import { answerIndexResponse, jsonResponse } from '@/lib/api-answers';
import { getQuestions } from '@/lib/supabase';

export async function GET() {
  const questions = await getQuestions();

  return jsonResponse(answerIndexResponse(questions));
}

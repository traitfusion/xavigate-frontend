import React, { useState, useEffect } from 'react';
import { Card, Button, Text } from '@/design-system/components';
import { MNTEST_ITEMS } from '@/data/mntest-items';

// Define the trait score type
interface TraitScores {
  [key: string]: number;
}

interface MNTestFormProps {
  onComplete: (scores: TraitScores) => void;
}

// Build questions array from imported MNTEST_ITEMS
const questions = MNTEST_ITEMS.map(item => ({
  id: item.id,
  text: item.text,
  trait: item.traitCategory,
}));

// Display one question per page for step-by-step assessment
const questionsPerPage = 1;
const totalPages = Math.ceil(questions.length / questionsPerPage);

export default function MNTestForm({ onComplete }: MNTestFormProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  // Debug: log total questions count to verify correct parsing
  useEffect(() => {
    console.log('MNTestForm: total questions loaded =', questions.length);
  }, []);
  // Get the current page's questions
  const getCurrentPageQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  /**
   * Calculate average score per trait based on user answers
   */
  const calculateScores = () => {
    const scores: Record<string, number> = {};
    const counts: Record<string, number> = {};
    // Sum ratings and count occurrences
    questions.forEach(({ id, trait }) => {
      const rating = answers[id];
      if (rating !== undefined) {
        scores[trait] = (scores[trait] || 0) + rating;
        counts[trait] = (counts[trait] || 0) + 1;
      }
    });
    // Compute average (1-5 scale)
    Object.keys(scores).forEach((trait) => {
      scores[trait] = scores[trait] / (counts[trait] || 1);
    });
    return scores;
  };

  // Handle going to the next page or completing the test
  const handleNext = async () => {
    // Check if all questions on the current page are answered
    const currentQuestions = getCurrentPageQuestions();
    const allAnswered = currentQuestions.every(q => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      alert("Please answer all questions before proceeding.");
      return;
    }

    // If this is the last page, calculate scores and complete
    if (currentPage === totalPages - 1) {
      const finalScores = calculateScores();
      
      // Pass the scores to the parent component
      onComplete(finalScores);
      
      // Parent component will handle saving to the backend
      console.log('Test completed with scores:', finalScores);
    } else {
      // Go to next page
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle going to the previous page
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle answer selection
  const handleAnswer = (questionId: number, rating: number) => {
    console.log(`MNTestForm: selected rating ${rating} for question ${questionId}`);
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };


  // Determine if current page's questions have all been answered
  const currentQuestions = getCurrentPageQuestions();
  const allAnswered = currentQuestions.every(q => answers[q.id] !== undefined);

  // Enable keyboard input: numeric keys to answer, Enter/ArrowRight to proceed
  useEffect(() => {
    const handleKeyGlobal = (e: KeyboardEvent) => {
      const key = e.key;
      // Number keys 1-5 select rating for current question
      if (key >= '1' && key <= '5') {
        const rating = parseInt(key, 10);
        const currentQuestion = getCurrentPageQuestions()[0];
        if (currentQuestion) {
          handleAnswer(currentQuestion.id, rating);
          e.preventDefault();
        }
      }
      // Enter or ArrowRight moves to next if answered
      if ((key === 'Enter' || key === 'ArrowRight') && allAnswered) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyGlobal);
    return () => window.removeEventListener('keydown', handleKeyGlobal);
  }, [allAnswered, currentPage, answers]);

  return (
    <Card padding="lg" style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Text variant="subtitle" style={{ fontSize: '1rem', fontWeight: 500 }}>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <div
          style={{
            height: '6px',
            backgroundColor: '#E5E7EB',
            borderRadius: '3px',
            margin: '10px auto',
            maxWidth: '200px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((currentPage + 1) / totalPages) * 100}%`,
              backgroundColor: '#4338ca',
              borderRadius: '3px',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </div>
      </div>

      {getCurrentPageQuestions().map((question) => (
        <div
          key={question.id}
          style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <Text
            variant="body"
            style={{
              marginBottom: '16px',
              fontSize: '1.5rem',
              fontWeight: 600,
              lineHeight: 1.4,
              textAlign: 'center',
              // Reserve space for up to two lines of question text to prevent shifting
              minHeight: '4.5rem',
            }}
          >
            {question.text}
          </Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleAnswer(question.id, rating)}
                style={{
                  minWidth: '56px',
                  minHeight: '56px',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor:
                    answers[question.id] === rating ? '#4338ca' : '#F3F4F6',
                  color: answers[question.id] === rating ? '#fff' : '#1F2937',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out',
                }}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          variant="secondary"
          style={{ padding: '16px 24px' }}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!allAnswered}
          style={{ padding: '16px 24px' }}
        >
          {currentPage === totalPages - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>
    </Card>
  );
}
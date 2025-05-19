/**
 * Auto-generated from MNTEST Items.csv
 * Contains all test items for the Multiple Intelligences and Multiple Natures assessment.
 */

/**
 * Represents a single test item in the MNTEST assessment
 */
export interface MNTestItem {
  /** Unique identifier for the item */
  id: number;
  /** The question text presented to the user */
  text: string;
  /** Whether this is a Multiple Intelligence or Multiple Nature item */
  type: 'MI' | 'MN';
  /** The specific trait category this item measures */
  traitCategory: string;
}

export const MNTEST_ITEMS: MNTestItem[] = [
  {
    id: 1,
    text: "When I'm given a task to perform, I do quality work in a timely manner.",
    type: 'MN',
    traitCategory: "Administrative"
  },
  {
    id: 2,
    text: "When I'm part of a project, I naturally take initiative in organizing tasks and making sure that the job is done.",
    type: 'MN',
    traitCategory: "Administrative"
  },
  {
    id: 3,
    text: "Planning objectives and doing what it takes to implement them is something I do easily.",
    type: 'MN',
    traitCategory: "Administrative"
  },
  {
    id: 4,
    text: "I use task lists and/or create reminders to make sure I do everything I have to do.",
    type: 'MN',
    traitCategory: "Administrative"
  },
  {
    id: 5,
    text: "I enjoy driving with speed when I travel by car, motorcycle, or bicycle.",
    type: 'MN',
    traitCategory: "Adventurous"
  },
  {
    id: 6,
    text: "I like to push myself to my limits because it gives me a thrill.",
    type: 'MN',
    traitCategory: "Adventurous"
  },
  {
    id: 7,
    text: "If I were invited to try a sport such as skydiving or bungee jumping, I would do so without hesitation.",
    type: 'MN',
    traitCategory: "Adventurous"
  },
  {
    id: 8,
    text: "If I had some extra money, I would invest it in shares rather than putting it in a safer, lower-paying method of investment.",
    type: 'MN',
    traitCategory: "Adventurous"
  },
  {
    id: 9,
    text: "I often find myself thinking up imaginative ideas that could be turned into stories, books, films, gadgets, and other such creations.",
    type: 'MN',
    traitCategory: "Creative"
  },
  {
    id: 10,
    text: "When I have to prepare a meal, I like to innovate and invent my own recipe rather than follow an existing one.",
    type: 'MN',
    traitCategory: "Creative"
  },
  {
    id: 11,
    text: "To celebrate the birthday of a family member or friend in an original way, I could come up with many ideas.",
    type: 'MN',
    traitCategory: "Creative"
  },
  {
    id: 12,
    text: "I often find original and unusual ideas to solve a problem.",
    type: 'MN',
    traitCategory: "Creative"
  },
  {
    id: 13,
    text: "I have the patience to repeat things several times if necessary until the other person understands.",
    type: 'MN',
    traitCategory: "Educative"
  },
  {
    id: 14,
    text: "I find it easy to explain a complex topic and get others to understand it.",
    type: 'MN',
    traitCategory: "Educative"
  },
  {
    id: 15,
    text: "As soon as I learn something new, I am eager to explain it to someone else.",
    type: 'MN',
    traitCategory: "Educative"
  },
  {
    id: 16,
    text: "When I have to explain something to someone, I find good examples to illustrate the idea clearly.",
    type: 'MN',
    traitCategory: "Educative"
  },
  {
    id: 17,
    text: "I like what I do to be the center of attention.",
    type: 'MN',
    traitCategory: "Entertaining"
  },
  {
    id: 18,
    text: "When I see people getting bored, I tend to do something for fun to amuse them.",
    type: 'MN',
    traitCategory: "Entertaining"
  },
  {
    id: 19,
    text: "I easily make others laugh or smile.",
    type: 'MN',
    traitCategory: "Entertaining"
  },
  {
    id: 20,
    text: "I can take something ordinary and express it in an exaggerated way--exciting or dramatic.",
    type: 'MN',
    traitCategory: "Entertaining"
  },
  {
    id: 21,
    text: "If I had to take out a new insurance contract for a car or motorcycle, I could easily negotiate prices for the best rate.",
    type: 'MN',
    traitCategory: "Entrepreneurial"
  },
  {
    id: 22,
    text: "Whenever I buy something, I make sure to buy a product that is the most useful for the price I pay.",
    type: 'MN',
    traitCategory: "Entrepreneurial"
  },
  {
    id: 23,
    text: "When I take a trip with friends, I easily find ways to manage limited budgets, spend the least amount possible, and maximize our ability to have a great time.",
    type: 'MN',
    traitCategory: "Entrepreneurial"
  },
  {
    id: 24,
    text: "I like to read about successful companies and how their leaders achieved success.",
    type: 'MN',
    traitCategory: "Entrepreneurial"
  },
  {
    id: 25,
    text: "If there are knots in a string, a ball of yarn, or cables, I take pleasure in undoing them.",
    type: 'MI',
    traitCategory: "Fine Bodily"
  },
  {
    id: 26,
    text: "When using a computer, I type quickly and accurately.",
    type: 'MI',
    traitCategory: "Fine Bodily"
  },
  {
    id: 27,
    text: "I can easily draw a straight line, even without a ruler.",
    type: 'MI',
    traitCategory: "Fine Bodily"
  },
  {
    id: 28,
    text: "I'm good with my hands for tasks such as cutting with scissors, tying shoelaces, using a knife or folding clothes.",
    type: 'MI',
    traitCategory: "Fine Bodily"
  },
  {
    id: 29,
    text: "When I visit someone's home, I observe the color of the walls, furniture, curtains, etc., and am able to see how well they match or not.",
    type: 'MI',
    traitCategory: "Graphic Visual"
  },
  {
    id: 30,
    text: "When looking at paintings and photos, I always notice details that others do not see.",
    type: 'MI',
    traitCategory: "Graphic Visual"
  },
  {
    id: 31,
    text: "I like to scribble (or draw pictures) when I listen to others because it helps me to focus on what they say.",
    type: 'MI',
    traitCategory: "Graphic Visual"
  },
  {
    id: 32,
    text: "When I want to convey my ideas, I like to use drawings, symbols, graphs, or images.",
    type: 'MI',
    traitCategory: "Graphic Visual"
  },
  {
    id: 33,
    text: "If I had to climb a ladder (e.g., to change a lightbulb), I would do it easily and without hesitation.",
    type: 'MI',
    traitCategory: "Gross Bodily"
  },
  {
    id: 34,
    text: "In sports activities, I am usually among the best players.",
    type: 'MI',
    traitCategory: "Gross Bodily"
  },
  {
    id: 35,
    text: "When I cannot solve a problem, I like to walk around to help me think.",
    type: 'MI',
    traitCategory: "Gross Bodily"
  },
  {
    id: 36,
    text: "If I participated in an exercise class, I could easily perform the movements taught by the instructor.",
    type: 'MI',
    traitCategory: "Gross Bodily"
  },
  {
    id: 37,
    text: "When I see that someone is not well, I tend to offer solutions to help them get better.",
    type: 'MN',
    traitCategory: "Healing"
  },
  {
    id: 38,
    text: "I am able to sense when someone is not feeling well.",
    type: 'MN',
    traitCategory: "Healing"
  },
  {
    id: 39,
    text: "I love reading articles or watching movies about the latest developments on wellbeing and the progress of medicine.",
    type: 'MN',
    traitCategory: "Healing"
  },
  {
    id: 40,
    text: "When a friend is sick, I am sincerely interested in the details of his or her health (symptoms, pain, problems, etc.).",
    type: 'MN',
    traitCategory: "Healing"
  },
  {
    id: 41,
    text: "When I'm at a party, I prefer to meet lots of people rather than spending time only with a few people.",
    type: 'MI',
    traitCategory: "Interpersonal"
  },
  {
    id: 42,
    text: "When a new employee joins my organization, I am usually the first one to go and introduce myself to him and get to know him.",
    type: 'MI',
    traitCategory: "Interpersonal"
  },
  {
    id: 43,
    text: "When I'm with others, I tend to ask a lot of questions about them and their lives.",
    type: 'MI',
    traitCategory: "Interpersonal"
  },
  {
    id: 44,
    text: "I have a large circle of acquaintances and I easily make new friends.",
    type: 'MI',
    traitCategory: "Interpersonal"
  },
  {
    id: 45,
    text: "If I read a quotation or proverb that talks about life, I try to understand it and see how it applies to my own life.",
    type: 'MI',
    traitCategory: "Intrapersonal"
  },
  {
    id: 46,
    text: "I like to analyze people or characters in books or movies and why they think and behave as they do.",
    type: 'MI',
    traitCategory: "Intrapersonal"
  },
  {
    id: 47,
    text: "In a bookstore, I like to spend more time in the section of personal development, philosophy, psychology, etc.",
    type: 'MI',
    traitCategory: "Intrapersonal"
  },
  {
    id: 48,
    text: "When something upsets me or makes me angry, I take the time to analyze my thoughts and feelings.",
    type: 'MI',
    traitCategory: "Intrapersonal"
  },
  {
    id: 49,
    text: "When I talk with others, I'm always able to express my thoughts and feelings in specific terms.",
    type: 'MI',
    traitCategory: "Linguistic"
  },
  {
    id: 50,
    text: "When I encounter a word I do not understand, I look up its definition and try to reuse it in conversation or when I write.",
    type: 'MI',
    traitCategory: "Linguistic"
  },
  {
    id: 51,
    text: "I have always had an ability for learning languages and would find it easy to learn a new one if I wanted to.",
    type: 'MI',
    traitCategory: "Linguistic"
  },
  {
    id: 52,
    text: "I'm good at crossword puzzles and other word games (anagrams, word search, etc.).",
    type: 'MI',
    traitCategory: "Linguistic"
  },
  {
    id: 53,
    text: "Before making a decision, I tend to gather information and analyze it carefully.",
    type: 'MI',
    traitCategory: "Logical"
  },
  {
    id: 54,
    text: "I find it easy to do math sums quickly, easily, and accurately in my head.",
    type: 'MI',
    traitCategory: "Logical"
  },
  {
    id: 55,
    text: "I am excellent at giving and following step-by-step directions.",
    type: 'MI',
    traitCategory: "Logical"
  },
  {
    id: 56,
    text: "I can quickly read and interpret tables, charts or graphics.",
    type: 'MI',
    traitCategory: "Logical"
  },
  {
    id: 57,
    text: "When I hear a song, I can tap out the beat with precision.",
    type: 'MI',
    traitCategory: "Musical"
  },
  {
    id: 58,
    text: "I often have music playing in my head.",
    type: 'MI',
    traitCategory: "Musical"
  },
  {
    id: 59,
    text: "If I hear a melody once, I can remember it and reproduce it accurately.",
    type: 'MI',
    traitCategory: "Musical"
  },
  {
    id: 60,
    text: "When I listen to music, I often analyze how the song was composed or arranged.",
    type: 'MI',
    traitCategory: "Musical"
  },
  {
    id: 61,
    text: "When I walk in the street, I am attentive to the different elements of nature.",
    type: 'MI',
    traitCategory: "Naturalistic"
  },
  {
    id: 62,
    text: "Although many people find most trees to be alike, I am able to spot many differences between them.",
    type: 'MI',
    traitCategory: "Naturalistic"
  },
  {
    id: 63,
    text: "I like the idea of having a pet.",
    type: 'MI',
    traitCategory: "Naturalistic"
  },
  {
    id: 64,
    text: "I like watching documentaries about animals and nature.",
    type: 'MI',
    traitCategory: "Naturalistic"
  },
  {
    id: 65,
    text: "If I saw someone trying to go swimming in an area that was marked as dangerous, I would attempt to stop or discourage them.",
    type: 'MN',
    traitCategory: "Protective"
  },
  {
    id: 66,
    text: "If I saw my taxi driver not wearing a seatbelt, I would suggest he or she put it on.",
    type: 'MN',
    traitCategory: "Protective"
  },
  {
    id: 67,
    text: "If someone were making fun of one of my friends, I would do something to stop them at once.",
    type: 'MN',
    traitCategory: "Protective"
  },
  {
    id: 68,
    text: "If I saw very young children playing in the street unattended, I would take the initiative to look after them.",
    type: 'MN',
    traitCategory: "Protective"
  },
  {
    id: 69,
    text: "If there were a free distribution of food, and they were looking for volunteers to help, I would give a helping hand without hesitation.",
    type: 'MN',
    traitCategory: "Providing"
  },
  {
    id: 70,
    text: "If a visually impaired person joined my company, I would offer my help to accompany him or her in getting around.",
    type: 'MN',
    traitCategory: "Providing"
  },
  {
    id: 71,
    text: "If I had to prepare a meal for someone, I would make sure to find what he or she likes to eat and would prepare it with pleasure.",
    type: 'MN',
    traitCategory: "Providing"
  },
  {
    id: 72,
    text: "When food comes to the table, I make sure that everyone else is served before serving myself.",
    type: 'MN',
    traitCategory: "Providing"
  },
  {
    id: 73,
    text: "If I travel to a new location, I can easily remember how to get there again.",
    type: 'MI',
    traitCategory: "Spatial Visual"
  },
  {
    id: 74,
    text: "I find it easy to pack a backpack or suitcase and optimize space to fit many things in it.",
    type: 'MI',
    traitCategory: "Spatial Visual"
  },
  {
    id: 75,
    text: "If I had to draw a diagram of my home from memory, I could easily do so with a high degree of accuracy.",
    type: 'MI',
    traitCategory: "Spatial Visual"
  },
  {
    id: 76,
    text: "I can always tell which way is North, South, East or West.",
    type: 'MI',
    traitCategory: "Spatial Visual"
  }
];

/** Just the Multiple Intelligence items */
export const MI_ITEMS = MNTEST_ITEMS.filter(item => item.type === 'MI');

/** Just the Multiple Nature items */
export const MN_ITEMS = MNTEST_ITEMS.filter(item => item.type === 'MN');

/**
 * Returns test items grouped by their trait category
 */
export function getItemsByCategory(): Record<string, MNTestItem[]> {
  return MNTEST_ITEMS.reduce((acc, item) => {
    if (!acc[item.traitCategory]) acc[item.traitCategory] = [];
    acc[item.traitCategory].push(item);
    return acc;
  }, {} as Record<string, MNTestItem[]>);
}
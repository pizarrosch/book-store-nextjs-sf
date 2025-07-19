import {CATEGORIES} from '../src/components/Drawer/Sidebar';
import {PrismaClient} from '../src/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

// Category to leave empty
const EMPTY_CATEGORY = 'Humor';

async function main() {
  console.log('Starting database population...');

  // Clear existing books
  await prisma.book.deleteMany({});
  console.log('Cleared existing books from database');

  // Populate books for each category
  for (const category of CATEGORIES) {
    // Skip the category we want to leave empty
    if (category === EMPTY_CATEGORY) {
      console.log(`Skipping category: ${category} (intentionally left empty)`);
      continue;
    }

    console.log(`Populating category: ${category}`);

    // Get books for this category
    const books = getBooksForCategory(category);

    // Save books to database
    for (const book of books) {
      await prisma.book.create({
        data: {
          id: book.id,
          title: book.title,
          authors: book.authors,
          description: book.description || '',
          averageRating: book.averageRating || 0,
          ratingsCount: book.ratingsCount || 0,
          thumbnailUrl: book.thumbnailUrl,
          price: book.price,
          category: category
        }
      });
    }

    console.log(`Added ${books.length} books to category: ${category}`);
  }

  console.log('Database population complete!');
}

// Function to get books for a specific category
function getBooksForCategory(_category: string): any[] {
  // Architecture books
  if (_category === 'Architecture') {
    return [
      {
        id: 'arch001',
        title: 'The Architecture of Happiness',
        authors: 'Alain de Botton',
        description: 'A study of how architecture affects our moods and lives.',
        averageRating: 4.2,
        ratingsCount: 12500,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1557683316-973673baf926',
        price: 19.99
      },
      {
        id: 'arch002',
        title: 'A Pattern Language',
        authors: 'Christopher Alexander, Sara Ishikawa, Murray Silverstein',
        description:
          'A seminal work on architectural patterns that influence our daily lives.',
        averageRating: 4.7,
        ratingsCount: 8900,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1557683311-eac922347aa1',
        price: 34.5
      },
      {
        id: 'arch003',
        title: 'The Eyes of the Skin',
        authors: 'Juhani Pallasmaa',
        description:
          'A profound exploration of architectural experience and our bodily senses.',
        averageRating: 4.6,
        ratingsCount: 5200,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
        price: 24.95
      },
      {
        id: 'arch004',
        title: 'Complexity and Contradiction in Architecture',
        authors: 'Robert Venturi',
        description:
          'A groundbreaking rejection of orthodox modernist aesthetic.',
        averageRating: 4.5,
        ratingsCount: 3800,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a',
        price: 29.99
      },
      {
        id: 'arch005',
        title: 'Delirious New York',
        authors: 'Rem Koolhaas',
        description:
          'A retroactive manifesto for Manhattan that explores the culture of congestion.',
        averageRating: 4.4,
        ratingsCount: 7300,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
        price: 27.5
      }
    ];
  }

  // Art & fashion books
  if (_category === 'Art & fashion') {
    return [
      {
        id: 'art001',
        title: 'Ways of Seeing',
        authors: 'John Berger',
        description:
          'A classic exploration of how we view art and the visual world around us.',
        averageRating: 4.5,
        ratingsCount: 18700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1551913902-c92207136625',
        price: 14.99
      },
      {
        id: 'art002',
        title: 'The Story of Art',
        authors: 'E.H. Gombrich',
        description:
          'One of the most famous and popular books on art ever written.',
        averageRating: 4.8,
        ratingsCount: 22500,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1551913902-d0e89b23792d',
        price: 39.95
      },
      {
        id: 'art003',
        title: 'The Fashion System',
        authors: 'Roland Barthes',
        description: 'A seminal work applying structural analysis to fashion.',
        averageRating: 4.2,
        ratingsCount: 5600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a',
        price: 22.5
      },
      {
        id: 'art004',
        title: 'Art as Experience',
        authors: 'John Dewey',
        description:
          'A philosophical approach to the experience of art and aesthetics.',
        averageRating: 4.6,
        ratingsCount: 7800,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
        price: 18.75
      },
      {
        id: 'art005',
        title: 'The Work of Art in the Age of Mechanical Reproduction',
        authors: 'Walter Benjamin',
        description:
          'A critical essay examining how mechanical reproduction changes art.',
        averageRating: 4.7,
        ratingsCount: 15200,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 12.99
      }
    ];
  }

  // Biography books
  if (_category === 'Biography') {
    return [
      {
        id: 'bio001',
        title: 'Steve Jobs',
        authors: 'Walter Isaacson',
        description: 'The definitive biography of Apple co-founder Steve Jobs.',
        averageRating: 4.6,
        ratingsCount: 45800,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1569017388730-020b5f80a004',
        price: 24.99
      },
      {
        id: 'bio002',
        title: 'Becoming',
        authors: 'Michelle Obama',
        description: 'A memoir by the former First Lady of the United States.',
        averageRating: 4.8,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 32.5
      },
      {
        id: 'bio003',
        title: 'The Diary of a Young Girl',
        authors: 'Anne Frank',
        description:
          'The writings from the Dutch-language diary kept by Anne Frank while in hiding.',
        averageRating: 4.7,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.95
      },
      {
        id: 'bio004',
        title: 'Long Walk to Freedom',
        authors: 'Nelson Mandela',
        description:
          "The autobiography of Nelson Mandela, leader of South Africa's anti-apartheid movement.",
        averageRating: 4.9,
        ratingsCount: 56300,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 21.99
      },
      {
        id: 'bio005',
        title: 'Einstein: His Life and Universe',
        authors: 'Walter Isaacson',
        description:
          'The definitive, internationally bestselling biography of Albert Einstein.',
        averageRating: 4.7,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 19.95
      }
    ];
  }

  // Business books
  if (_category === 'Business') {
    return [
      {
        id: 'bus001',
        title: 'Good to Great',
        authors: 'Jim Collins',
        description: "Why some companies make the leap and others don't.",
        averageRating: 4.5,
        ratingsCount: 78900,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
        price: 29.99
      },
      {
        id: 'bus002',
        title: 'Zero to One',
        authors: 'Peter Thiel, Blake Masters',
        description: 'Notes on startups, or how to build the future.',
        averageRating: 4.6,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556155092-490a1ba16284',
        price: 26.95
      },
      {
        id: 'bus003',
        title: 'The Lean Startup',
        authors: 'Eric Ries',
        description:
          'How constant innovation creates radically successful businesses.',
        averageRating: 4.4,
        ratingsCount: 89700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556155092-8707de31f9c4',
        price: 24.99
      },
      {
        id: 'bus004',
        title: 'Thinking, Fast and Slow',
        authors: 'Daniel Kahneman',
        description:
          'A groundbreaking tour of the mind explaining the two systems that drive the way we think.',
        averageRating: 4.7,
        ratingsCount: 102300,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493612276216-ee3925520721',
        price: 32.5
      },
      {
        id: 'bus005',
        title: "The Innovator's Dilemma",
        authors: 'Clayton M. Christensen',
        description: 'When new technologies cause great firms to fail.',
        averageRating: 4.5,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
        price: 28.75
      }
    ];
  }

  // Drama books
  if (_category === 'Drama') {
    return [
      {
        id: 'dra001',
        title: 'Hamlet',
        authors: 'William Shakespeare',
        description: "Shakespeare's tragic tale of the Prince of Denmark.",
        averageRating: 4.8,
        ratingsCount: 156700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910cc0',
        price: 12.99
      },
      {
        id: 'dra002',
        title: 'Death of a Salesman',
        authors: 'Arthur Miller',
        description:
          'A classic American play about the disillusionment of the American Dream.',
        averageRating: 4.6,
        ratingsCount: 78500,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910cc0',
        price: 14.5
      },
      {
        id: 'dra003',
        title: 'A Streetcar Named Desire',
        authors: 'Tennessee Williams',
        description:
          'A play that reveals the depths of human emotion and psychology.',
        averageRating: 4.7,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910cc0',
        price: 13.95
      },
      {
        id: 'dra004',
        title: 'Waiting for Godot',
        authors: 'Samuel Beckett',
        description: 'A masterpiece of absurdist theatre.',
        averageRating: 4.5,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910cc0',
        price: 15.99
      },
      {
        id: 'dra005',
        title: 'The Crucible',
        authors: 'Arthur Miller',
        description: 'A dramatized story of the Salem witch trials.',
        averageRating: 4.6,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910cc0',
        price: 14.25
      }
    ];
  }

  // Fiction books
  if (_category === 'Fiction') {
    return [
      {
        id: 'fic001',
        title: 'To Kill a Mockingbird',
        authors: 'Harper Lee',
        description:
          'A classic of modern American literature set in the American South.',
        averageRating: 4.9,
        ratingsCount: 245600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 15.99
      },
      {
        id: 'fic002',
        title: '1984',
        authors: 'George Orwell',
        description:
          'A dystopian social science fiction novel and cautionary tale.',
        averageRating: 4.8,
        ratingsCount: 198700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.5
      },
      {
        id: 'fic003',
        title: 'The Great Gatsby',
        authors: 'F. Scott Fitzgerald',
        description:
          'A novel of the Jazz Age that captures the spirit of America in the 1920s.',
        averageRating: 4.7,
        ratingsCount: 178900,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 13.95
      },
      {
        id: 'fic004',
        title: 'Pride and Prejudice',
        authors: 'Jane Austen',
        description:
          'A romantic novel of manners that depicts the emotional development of Elizabeth Bennet.',
        averageRating: 4.8,
        ratingsCount: 210500,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 12.99
      },
      {
        id: 'fic005',
        title: 'The Catcher in the Rye',
        authors: 'J.D. Salinger',
        description:
          'A novel that captures the alienation and rebellion of adolescence.',
        averageRating: 4.6,
        ratingsCount: 156700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.25
      }
    ];
  }

  // Food & Drink books
  if (_category === 'Food & Drink') {
    return [
      {
        id: 'food001',
        title: 'Salt, Fat, Acid, Heat',
        authors: 'Samin Nosrat',
        description: 'Mastering the elements of good cooking.',
        averageRating: 4.8,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
        price: 35.0
      },
      {
        id: 'food002',
        title: 'The Joy of Cooking',
        authors: 'Irma S. Rombauer, Marion Rombauer Becker, Ethan Becker',
        description: 'A kitchen classic for over 80 years.',
        averageRating: 4.7,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
        price: 40.0
      },
      {
        id: 'food003',
        title: 'Mastering the Art of French Cooking',
        authors: 'Julia Child, Louisette Bertholle, Simone Beck',
        description:
          'The classic cookbook that revolutionized home cooking in America.',
        averageRating: 4.9,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
        price: 45.0
      },
      {
        id: 'food004',
        title: 'The Food Lab',
        authors: 'J. Kenji López-Alt',
        description: 'Better home cooking through science.',
        averageRating: 4.8,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
        price: 49.95
      },
      {
        id: 'food005',
        title: 'Plenty',
        authors: 'Yotam Ottolenghi',
        description: "Vibrant vegetable recipes from London's Ottolenghi.",
        averageRating: 4.7,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65',
        price: 35.0
      }
    ];
  }

  // Health & Wellbeing books
  if (_category === 'Health & Wellbeing') {
    return [
      {
        id: 'health001',
        title: 'Why We Sleep',
        authors: 'Matthew Walker',
        description: 'Unlocking the power of sleep and dreams.',
        averageRating: 4.7,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 17.99
      },
      {
        id: 'health002',
        title: 'Atomic Habits',
        authors: 'James Clear',
        description:
          'An easy and proven way to build good habits and break bad ones.',
        averageRating: 4.8,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 27.0
      },
      {
        id: 'health003',
        title: 'The Body Keeps the Score',
        authors: 'Bessel van der Kolk',
        description: 'Brain, mind, and body in the healing of trauma.',
        averageRating: 4.9,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 19.0
      },
      {
        id: 'health004',
        title: 'How Not to Die',
        authors: 'Michael Greger, Gene Stone',
        description:
          'Discover the foods scientifically proven to prevent and reverse disease.',
        averageRating: 4.8,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 32.5
      },
      {
        id: 'health005',
        title: 'Breath',
        authors: 'James Nestor',
        description: 'The new science of a lost art.',
        averageRating: 4.7,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 28.0
      }
    ];
  }

  // History & Politics books
  if (_category === 'History & Politics') {
    return [
      {
        id: 'hist001',
        title: 'Sapiens',
        authors: 'Yuval Noah Harari',
        description: 'A brief history of humankind.',
        averageRating: 4.8,
        ratingsCount: 245600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 24.99
      },
      {
        id: 'hist002',
        title: 'Guns, Germs, and Steel',
        authors: 'Jared Diamond',
        description: 'The fates of human societies.',
        averageRating: 4.7,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 18.95
      },
      {
        id: 'hist003',
        title: 'The Silk Roads',
        authors: 'Peter Frankopan',
        description: 'A new history of the world.',
        averageRating: 4.6,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 22.0
      },
      {
        id: 'hist004',
        title: "A People's History of the United States",
        authors: 'Howard Zinn',
        description:
          'The history of the United States from the perspective of the common people.',
        averageRating: 4.7,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 21.99
      },
      {
        id: 'hist005',
        title: 'The Origins of Political Order',
        authors: 'Francis Fukuyama',
        description: 'From prehuman times to the French Revolution.',
        averageRating: 4.6,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 35.0
      }
    ];
  }

  // Poetry books
  if (_category === 'Poetry') {
    return [
      {
        id: 'poet001',
        title: 'Milk and Honey',
        authors: 'Rupi Kaur',
        description:
          'A collection of poetry and prose about survival, the experience of violence, abuse, love, loss, and femininity.',
        averageRating: 4.5,
        ratingsCount: 156700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.99
      },
      {
        id: 'poet002',
        title: 'The Sun and Her Flowers',
        authors: 'Rupi Kaur',
        description:
          'A journey of wilting, falling, rooting, rising, and blooming.',
        averageRating: 4.6,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 16.99
      },
      {
        id: 'poet003',
        title: 'The Odyssey',
        authors: 'Homer, Emily Wilson (Translator)',
        description: "A new translation of Homer's epic poem.",
        averageRating: 4.7,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 29.95
      },
      {
        id: 'poet004',
        title: 'Leaves of Grass',
        authors: 'Walt Whitman',
        description: "Whitman's seminal poetry collection.",
        averageRating: 4.8,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 18.5
      },
      {
        id: 'poet005',
        title: 'The Complete Poems of Emily Dickinson',
        authors: 'Emily Dickinson',
        description: "The complete works of one of America's greatest poets.",
        averageRating: 4.9,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 22.0
      }
    ];
  }

  // Psychology books
  if (_category === 'Psychology') {
    return [
      {
        id: 'psych001',
        title: 'Thinking, Fast and Slow',
        authors: 'Daniel Kahneman',
        description:
          'A groundbreaking tour of the mind explaining the two systems that drive the way we think.',
        averageRating: 4.7,
        ratingsCount: 102300,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 17.99
      },
      {
        id: 'psych002',
        title: 'Man and His Symbols',
        authors: 'Carl G. Jung',
        description:
          "Jung's final work, giving a clear explanation of his theories.",
        averageRating: 4.6,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 15.95
      },
      {
        id: 'psych003',
        title: 'The Interpretation of Dreams',
        authors: 'Sigmund Freud',
        description:
          "Freud's revolutionary theory of dreams as the gateway to the unconscious.",
        averageRating: 4.5,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.99
      },
      {
        id: 'psych004',
        title: 'Quiet',
        authors: 'Susan Cain',
        description:
          'The power of introverts in a world that cannot stop talking.',
        averageRating: 4.8,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 16.0
      },
      {
        id: 'psych005',
        title: 'Flow',
        authors: 'Mihaly Csikszentmihalyi',
        description: 'The psychology of optimal experience.',
        averageRating: 4.6,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 18.99
      }
    ];
  }

  // Science books
  if (_category === 'Science') {
    return [
      {
        id: 'sci001',
        title: 'A Brief History of Time',
        authors: 'Stephen Hawking',
        description: 'From the Big Bang to black holes.',
        averageRating: 4.8,
        ratingsCount: 156700,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 18.99
      },
      {
        id: 'sci002',
        title: 'The Selfish Gene',
        authors: 'Richard Dawkins',
        description: 'A landmark work in the field of evolutionary biology.',
        averageRating: 4.7,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 15.95
      },
      {
        id: 'sci003',
        title: 'Cosmos',
        authors: 'Carl Sagan',
        description: 'A journey through the universe.',
        averageRating: 4.9,
        ratingsCount: 125000,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 17.5
      },
      {
        id: 'sci004',
        title: 'The Origin of Species',
        authors: 'Charles Darwin',
        description: 'The foundation of evolutionary biology.',
        averageRating: 4.8,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 12.99
      },
      {
        id: 'sci005',
        title: 'Silent Spring',
        authors: 'Rachel Carson',
        description: 'The classic that launched the environmental movement.',
        averageRating: 4.7,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 14.5
      }
    ];
  }

  // Technology books
  if (_category === 'Technology') {
    return [
      {
        id: 'tech001',
        title: 'The Innovators',
        authors: 'Walter Isaacson',
        description:
          'How a group of hackers, geniuses, and geeks created the digital revolution.',
        averageRating: 4.7,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 19.99
      },
      {
        id: 'tech002',
        title: 'Clean Code',
        authors: 'Robert C. Martin',
        description: 'A handbook of agile software craftsmanship.',
        averageRating: 4.8,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 44.95
      },
      {
        id: 'tech003',
        title: 'Design Patterns',
        authors: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        description: 'Elements of reusable object-oriented software.',
        averageRating: 4.7,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 59.99
      },
      {
        id: 'tech004',
        title: 'The Pragmatic Programmer',
        authors: 'Andrew Hunt, David Thomas',
        description: 'From journeyman to master.',
        averageRating: 4.8,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 39.95
      },
      {
        id: 'tech005',
        title: 'Code',
        authors: 'Charles Petzold',
        description: 'The hidden language of computer hardware and software.',
        averageRating: 4.7,
        ratingsCount: 25600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 27.99
      }
    ];
  }

  // Travel & Maps books
  if (_category === 'Travel & Maps') {
    return [
      {
        id: 'travel001',
        title: 'Lonely Planet Japan',
        authors: 'Lonely Planet',
        description: 'Travel guide to Japan.',
        averageRating: 4.7,
        ratingsCount: 45600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 24.99
      },
      {
        id: 'travel002',
        title: 'Into the Wild',
        authors: 'Jon Krakauer',
        description:
          "The story of Christopher McCandless's journey into the Alaskan wilderness.",
        averageRating: 4.6,
        ratingsCount: 87600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 15.0
      },
      {
        id: 'travel003',
        title: 'In a Sunburned Country',
        authors: 'Bill Bryson',
        description:
          "A humorous account of the author's travels through Australia.",
        averageRating: 4.5,
        ratingsCount: 32100,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 16.99
      },
      {
        id: 'travel004',
        title: 'The Art of Travel',
        authors: 'Alain de Botton',
        description:
          'A philosophical look at the ubiquitous but peculiar activity of travelling.',
        averageRating: 4.4,
        ratingsCount: 25600,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 17.5
      },
      {
        id: 'travel005',
        title: 'Atlas Obscura',
        authors: 'Joshua Foer, Dylan Thuras, Ella Morton',
        description: "An explorer's guide to the world's hidden wonders.",
        averageRating: 4.8,
        ratingsCount: 65400,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544967082-d9d25d867d66',
        price: 35.0
      }
    ];
  }

  // Default empty array
  return [];
}

// Run the script
main()
  .catch((e) => {
    console.error('Error populating database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

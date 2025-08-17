// Mock backend for testing without deployed canister
const mockBackend = {
  start_session: async () => ({ Ok: "Session started" }),
  get_arc_challenge: async (num: number) => {
    // Define some ARC-AGI style challenges
    const challenges = [
      {
        id: `arc_challenge_${num}`,
        examples: [
          {
            input: {
              cells: [
                ["pink", "black"],
                ["black", "yellow"],
              ],
            },
            output: {
              cells: [
                ["yellow", "black"],
                ["black", "pink"],
              ],
            },
          },
          {
            input: {
              cells: [
                ["yellow", "pink"],
                ["black", "black"],
              ],
            },
            output: {
              cells: [
                ["black", "black"],
                ["yellow", "pink"],
              ],
            },
          },
        ],
        testInput: {
          cells: [
            ["black", "pink"],
            ["pink", "black"],
          ],
        },
        solution: {
          cells: [
            ["pink", "black"],
            ["black", "pink"],
          ],
        },
        patternType: "diagonal_flip",
      },
      {
        id: `arc_challenge_${num}`,
        examples: [
          {
            input: {
              cells: [
                ["pink", "yellow"],
                ["yellow", "pink"],
              ],
            },
            output: {
              cells: [
                ["yellow", "pink"],
                ["pink", "yellow"],
              ],
            },
          },
          {
            input: {
              cells: [
                ["black", "pink"],
                ["pink", "black"],
              ],
            },
            output: {
              cells: [
                ["pink", "black"],
                ["black", "pink"],
              ],
            },
          },
        ],
        testInput: {
          cells: [
            ["yellow", "black"],
            ["pink", "yellow"],
          ],
        },
        solution: {
          cells: [
            ["black", "yellow"],
            ["yellow", "pink"],
          ],
        },
        patternType: "color_swap",
      },
      {
        id: `arc_challenge_${num}`,
        examples: [
          {
            input: {
              cells: [
                ["pink", "black"],
                ["yellow", "pink"],
              ],
            },
            output: {
              cells: [
                ["yellow", "pink"],
                ["black", "pink"],
              ],
            },
          },
          {
            input: {
              cells: [
                ["yellow", "pink"],
                ["black", "yellow"],
              ],
            },
            output: {
              cells: [
                ["black", "yellow"],
                ["pink", "yellow"],
              ],
            },
          },
        ],
        testInput: {
          cells: [
            ["black", "yellow"],
            ["pink", "black"],
          ],
        },
        solution: {
          cells: [
            ["pink", "black"],
            ["yellow", "black"],
          ],
        },
        patternType: "rotate_90",
      },
    ];

    return { Ok: challenges[(num - 1) % challenges.length] };
  },
  get_challenge: async (num: number) => ({
    Ok: {
      id: `challenge_${num}`,
      grid: [
        [{ color: "R" }, { color: "B" }],
        [{ color: "B" }, { color: "R" }],
      ],
      options: [
        [
          [{ color: "B" }, { color: "R" }],
          [{ color: "R" }, { color: "B" }],
        ], // Correct
        [
          [{ color: "R" }, { color: "R" }],
          [{ color: "B" }, { color: "B" }],
        ],
        [
          [{ color: "G" }, { color: "B" }],
          [{ color: "B" }, { color: "G" }],
        ],
        [
          [{ color: "R" }, { color: "G" }],
          [{ color: "G" }, { color: "R" }],
        ],
      ],
      correct_answer: 0,
      challenge_type: "rotation",
    },
  }),
  verify_arc_answer: async (challengeId: string, userGrid: any) => {
    // In a real implementation, this would validate against the stored solution
    // For now, we'll simulate validation
    return { Ok: Math.random() > 0.3 }; // 70% success rate for testing
  },
  verify_answer: async (id: string, answer: number) => ({ Ok: answer === 0 }),
  mint_proof: async () => ({ Ok: "NFT minted successfully" }),
  check_humanity_status: async () => ({ Err: "No token found" }),
  create_post: async (title: string, content: string) => {
    if (!localStorage.getItem("humanityToken")) {
      return { Err: "CHALLENGE_REQUIRED" };
    }
    return { Ok: `post_${Date.now()}` };
  },
  get_all_posts: async () => [
    {
      id: "post_1",
      title: "Welcome to the Living Internet Protocol Forum",
      content: "This is a demo post showing the forum functionality.",
      author: "0x123...abc",
      created_at: BigInt(Date.now() - 3600000),
      author_verified: true,
    },
  ],
  refresh_token: async () => {
    localStorage.setItem(
      "humanityToken",
      JSON.stringify({
        principal: "test_user",
        verified_at: Date.now(),
        expires_at: Date.now() + 24 * 60 * 60 * 1000,
      }),
    );
    return { Ok: "Token refreshed" };
  },
};

const backend = mockBackend;
// Uncomment when backend is deployed:
// import { backend } from "../../../declarations/backend";

// Type definitions for LIP
export interface GridCell {
  color: string;
}

export interface Challenge {
  id: string;
  grid: GridCell[][];
  options: GridCell[][][];
  correct_answer: number;
  challenge_type: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: bigint;
  author_verified: boolean;
}

export interface HumanityToken {
  principal: string;
  verified_at: bigint;
  expires_at: bigint;
}

type Result<T, E> = { Ok: T } | { Err: E };

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  /**
   * Start a new verification session
   * @returns Promise with session status
   */
  async start_session(): Promise<Result<string, string>> {
    return await backend.start_session();
  },

  /**
   * Get a challenge by number
   * @param challenge_number Challenge number (1-3)
   * @returns Promise with the challenge
   */
  async get_challenge(
    challenge_number: number,
  ): Promise<Result<Challenge, string>> {
    return await backend.get_challenge(challenge_number);
  },

  /**
   * Verify an answer for a challenge
   * @param challenge_id Challenge ID
   * @param answer Answer index
   * @returns Promise with verification result
   */
  async verify_answer(
    challenge_id: string,
    answer: number,
  ): Promise<Result<boolean, string>> {
    return await backend.verify_answer(challenge_id, answer);
  },

  /**
   * Mint proof of humanity NFT
   * @returns Promise with minting result
   */
  async mint_proof(): Promise<Result<string, string>> {
    return await backend.mint_proof();
  },

  /**
   * Check humanity token status
   * @returns Promise with token status
   */
  async check_humanity_status(): Promise<Result<HumanityToken, string>> {
    return await backend.check_humanity_status();
  },

  /**
   * Create a new post (requires valid token)
   * @param title Post title
   * @param content Post content
   * @returns Promise with post ID or error
   */
  async create_post(
    title: string,
    content: string,
  ): Promise<Result<string, string>> {
    return await backend.create_post(title, content);
  },

  /**
   * Get all posts
   * @returns Promise with all posts
   */
  async get_all_posts(): Promise<Post[]> {
    return await backend.get_all_posts();
  },

  /**
   * Refresh humanity token after challenge
   * @returns Promise with refresh result
   */
  async refresh_token(): Promise<Result<string, string>> {
    return await backend.refresh_token();
  },

  /**
   * Get an ARC-AGI style challenge
   * @param challenge_number Challenge number
   * @returns Promise with ARC challenge data
   */
  async get_arc_challenge(
    challenge_number: number,
  ): Promise<Result<any, string>> {
    return await backend.get_arc_challenge(challenge_number);
  },

  /**
   * Verify an ARC-AGI challenge answer
   * @param challenge_id Challenge ID
   * @param user_grid User's grid solution
   * @returns Promise with verification result
   */
  async verify_arc_answer(
    challenge_id: string,
    user_grid: any,
  ): Promise<Result<boolean, string>> {
    return await backend.verify_arc_answer(challenge_id, user_grid);
  },
};

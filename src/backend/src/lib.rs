use ic_cdk::export_candid;
use std::cell::RefCell;
use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use std::collections::HashMap;

// Challenge types
#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GridCell {
    color: String, // "R", "B", "G", "Y" for Red, Blue, Green, Yellow
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Challenge {
    id: String,
    grid: Vec<Vec<GridCell>>,
    options: Vec<Vec<Vec<GridCell>>>,
    correct_answer: u8,
    challenge_type: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct UserSession {
    principal: String,
    challenges_completed: u8,
    current_challenge: Option<Challenge>,
    started_at: u64,
    completed_at: Option<u64>,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Post {
    id: String,
    title: String,
    content: String,
    author: String,
    created_at: u64,
    author_verified: bool,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct HumanityToken {
    principal: String,
    verified_at: u64,
    expires_at: u64,
}

// Storage
thread_local! {
    static SESSIONS: RefCell<HashMap<String, UserSession>> = RefCell::new(HashMap::new());
    static VERIFIED_HUMANS: RefCell<HashMap<String, u64>> = RefCell::new(HashMap::new());
    static POSTS: RefCell<Vec<Post>> = RefCell::new(Vec::new());
    static HUMANITY_TOKENS: RefCell<HashMap<String, HumanityToken>> = RefCell::new(HashMap::new());
}

// Token expiry constant (24 hours in nanoseconds)
const TOKEN_EXPIRY_NS: u64 = 24 * 60 * 60 * 1_000_000_000;

// Generate a simple rotation pattern challenge
#[ic_cdk::update]
fn get_challenge(challenge_number: u8) -> Result<Challenge, String> {
    let caller = ic_cdk::caller().to_string();
    
    // Get the challenge
    let challenge = match challenge_number {
        1 => create_rotation_challenge(),
        2 => create_color_sequence_challenge(),
        3 => create_transformation_challenge(),
        _ => return Err("Invalid challenge number".to_string()),
    };
    
    // Update session with current challenge
    SESSIONS.with(|sessions| {
        let mut sessions = sessions.borrow_mut();
        if let Some(session) = sessions.get_mut(&caller) {
            session.current_challenge = Some(challenge.clone());
        }
    });
    
    Ok(challenge)
}

// Verify user's answer
#[ic_cdk::update]
fn verify_answer(challenge_id: String, answer: u8) -> Result<bool, String> {
    let caller = ic_cdk::caller().to_string();
    
    SESSIONS.with(|sessions| {
        let mut sessions = sessions.borrow_mut();
        let session = sessions.get_mut(&caller).ok_or("No active session")?;
        
        match &session.current_challenge {
            Some(challenge) if challenge.id == challenge_id => {
                let is_correct = challenge.correct_answer == answer;
                if is_correct {
                    session.challenges_completed += 1;
                }
                Ok(is_correct)
            }
            _ => Err("Invalid challenge".to_string())
        }
    })
}

// Start a new verification session
#[ic_cdk::update]
fn start_session() -> Result<String, String> {
    let caller = ic_cdk::caller().to_string();
    
    SESSIONS.with(|sessions| {
        let mut sessions = sessions.borrow_mut();
        
        // Check if already verified
        VERIFIED_HUMANS.with(|humans| {
            if humans.borrow().contains_key(&caller) {
                return Err("Already verified".to_string());
            }
            Ok(())
        })?;
        
        let session = UserSession {
            principal: caller.clone(),
            challenges_completed: 0,
            current_challenge: None,
            started_at: time(),
            completed_at: None,
        };
        
        sessions.insert(caller.clone(), session);
        Ok("Session started".to_string())
    })
}

// Mint proof of humanity NFT
#[ic_cdk::update]
async fn mint_proof() -> Result<String, String> {
    let caller = ic_cdk::caller().to_string();
    
    SESSIONS.with(|sessions| {
        let sessions = sessions.borrow();
        let session = sessions.get(&caller).ok_or("No session found")?;
        
        if session.challenges_completed < 3 {
            return Err("Must complete all challenges".to_string());
        }
        
        // Create humanity token
        let now = time();
        let token = HumanityToken {
            principal: caller.clone(),
            verified_at: now,
            expires_at: now + TOKEN_EXPIRY_NS,
        };
        
        HUMANITY_TOKENS.with(|tokens| {
            tokens.borrow_mut().insert(caller.clone(), token);
        });
        
        VERIFIED_HUMANS.with(|humans| {
            let mut humans = humans.borrow_mut();
            humans.insert(caller.clone(), now);
        });
        
        Ok(format!("NFT minted and humanity token created for {}", caller))
    })
}

// Check if user has valid humanity token
#[ic_cdk::query]
fn check_humanity_status() -> Result<HumanityToken, String> {
    let caller = ic_cdk::caller().to_string();
    
    HUMANITY_TOKENS.with(|tokens| {
        let tokens = tokens.borrow();
        match tokens.get(&caller) {
            Some(token) => {
                let now = time();
                if token.expires_at > now {
                    Ok(token.clone())
                } else {
                    Err("Token expired".to_string())
                }
            }
            None => Err("No token found".to_string())
        }
    })
}

// Create a new post (requires valid token)
#[ic_cdk::update]
fn create_post(title: String, content: String) -> Result<String, String> {
    let caller = ic_cdk::caller().to_string();
    
    // Check token validity
    let token_valid = HUMANITY_TOKENS.with(|tokens| {
        let tokens = tokens.borrow();
        match tokens.get(&caller) {
            Some(token) => token.expires_at > time(),
            None => false
        }
    });
    
    if !token_valid {
        return Err("CHALLENGE_REQUIRED".to_string());
    }
    
    // Validate input
    if title.trim().is_empty() || content.trim().is_empty() {
        return Err("Title and content are required".to_string());
    }
    
    if title.len() > 200 {
        return Err("Title too long (max 200 chars)".to_string());
    }
    
    if content.len() > 5000 {
        return Err("Content too long (max 5000 chars)".to_string());
    }
    
    // Create post
    let post_id = format!("post_{}", time());
    let post = Post {
        id: post_id.clone(),
        title: title.trim().to_string(),
        content: content.trim().to_string(),
        author: caller,
        created_at: time(),
        author_verified: true,
    };
    
    POSTS.with(|posts| {
        posts.borrow_mut().push(post);
    });
    
    Ok(post_id)
}

// Get all posts (public)
#[ic_cdk::query]
fn get_all_posts() -> Vec<Post> {
    POSTS.with(|posts| {
        let mut posts_vec = posts.borrow().clone();
        // Sort by newest first
        posts_vec.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        posts_vec
    })
}

// Refresh token after successful challenge
#[ic_cdk::update]
fn refresh_token() -> Result<String, String> {
    let caller = ic_cdk::caller().to_string();
    
    // Check if user completed challenges
    let has_completed_challenges = SESSIONS.with(|sessions| {
        sessions.borrow()
            .get(&caller)
            .map(|s| s.challenges_completed >= 1) // For re-verification, only 1 challenge needed
            .unwrap_or(false)
    });
    
    if !has_completed_challenges {
        return Err("Must complete challenge first".to_string());
    }
    
    let now = time();
    let token = HumanityToken {
        principal: caller.clone(),
        verified_at: now,
        expires_at: now + TOKEN_EXPIRY_NS,
    };
    
    HUMANITY_TOKENS.with(|tokens| {
        tokens.borrow_mut().insert(caller, token);
    });
    
    Ok("Token refreshed".to_string())
}

// Helper functions to create challenges
fn create_rotation_challenge() -> Challenge {
    Challenge {
        id: "rotation_1".to_string(),
        grid: vec![
            vec![GridCell { color: "R".to_string() }, GridCell { color: "B".to_string() }],
            vec![GridCell { color: "B".to_string() }, GridCell { color: "R".to_string() }],
        ],
        options: vec![
            // Option A - correct (90° rotation)
            vec![
                vec![GridCell { color: "B".to_string() }, GridCell { color: "R".to_string() }],
                vec![GridCell { color: "R".to_string() }, GridCell { color: "B".to_string() }],
            ],
            // Option B - incorrect
            vec![
                vec![GridCell { color: "R".to_string() }, GridCell { color: "R".to_string() }],
                vec![GridCell { color: "B".to_string() }, GridCell { color: "B".to_string() }],
            ],
            // Option C - incorrect
            vec![
                vec![GridCell { color: "G".to_string() }, GridCell { color: "B".to_string() }],
                vec![GridCell { color: "B".to_string() }, GridCell { color: "G".to_string() }],
            ],
            // Option D - incorrect
            vec![
                vec![GridCell { color: "R".to_string() }, GridCell { color: "G".to_string() }],
                vec![GridCell { color: "G".to_string() }, GridCell { color: "R".to_string() }],
            ],
        ],
        correct_answer: 0,
        challenge_type: "rotation".to_string(),
    }
}

fn create_color_sequence_challenge() -> Challenge {
    Challenge {
        id: "sequence_1".to_string(),
        grid: vec![
            vec![GridCell { color: "Y".to_string() }, GridCell { color: "Y".to_string() }],
            vec![GridCell { color: "Y".to_string() }, GridCell { color: "Y".to_string() }],
        ],
        options: vec![
            // Option A - incorrect
            vec![
                vec![GridCell { color: "R".to_string() }, GridCell { color: "R".to_string() }],
                vec![GridCell { color: "R".to_string() }, GridCell { color: "R".to_string() }],
            ],
            // Option B - correct (following pattern R->B->G->Y)
            vec![
                vec![GridCell { color: "R".to_string() }, GridCell { color: "R".to_string() }],
                vec![GridCell { color: "R".to_string() }, GridCell { color: "R".to_string() }],
            ],
            // Option C - incorrect
            vec![
                vec![GridCell { color: "B".to_string() }, GridCell { color: "B".to_string() }],
                vec![GridCell { color: "B".to_string() }, GridCell { color: "B".to_string() }],
            ],
            // Option D - incorrect
            vec![
                vec![GridCell { color: "G".to_string() }, GridCell { color: "G".to_string() }],
                vec![GridCell { color: "G".to_string() }, GridCell { color: "G".to_string() }],
            ],
        ],
        correct_answer: 1,
        challenge_type: "sequence".to_string(),
    }
}

fn create_transformation_challenge() -> Challenge {
    Challenge {
        id: "transform_1".to_string(),
        grid: vec![
            vec![GridCell { color: "G".to_string() }, GridCell { color: "R".to_string() }],
            vec![GridCell { color: "Y".to_string() }, GridCell { color: "B".to_string() }],
        ],
        options: vec![
            // Option A - incorrect
            vec![
                vec![GridCell { color: "G".to_string() }, GridCell { color: "Y".to_string() }],
                vec![GridCell { color: "R".to_string() }, GridCell { color: "B".to_string() }],
            ],
            // Option B - incorrect
            vec![
                vec![GridCell { color: "R".to_string() }, GridCell { color: "G".to_string() }],
                vec![GridCell { color: "B".to_string() }, GridCell { color: "Y".to_string() }],
            ],
            // Option C - correct (diagonal swap)
            vec![
                vec![GridCell { color: "B".to_string() }, GridCell { color: "Y".to_string() }],
                vec![GridCell { color: "R".to_string() }, GridCell { color: "G".to_string() }],
            ],
            // Option D - incorrect
            vec![
                vec![GridCell { color: "Y".to_string() }, GridCell { color: "B".to_string() }],
                vec![GridCell { color: "G".to_string() }, GridCell { color: "R".to_string() }],
            ],
        ],
        correct_answer: 2,
        challenge_type: "transformation".to_string(),
    }
}

export_candid!();
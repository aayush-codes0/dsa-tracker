-- ============================================================
-- DSA Tracker — Seed Data
-- Striver A2Z DSA Sheet Inspired Problems
-- ============================================================

USE dsa_tracker;

-- ─── TOPICS (12) ─────────────────────────────────────────────
INSERT INTO topics (topic_name, icon, color_hex, description, total_problems) VALUES
('Arrays',                   '📊', '#3B82F6', 'Array manipulation, searching, sorting, and two-pointer techniques', 8),
('Strings',                  '🔤', '#8B5CF6', 'String processing, pattern matching, and palindromes', 6),
('Linked List',              '🔗', '#EC4899', 'Singly, doubly linked lists, cycle detection, reversal', 6),
('Stack',                    '📚', '#F59E0B', 'Stack operations, monotonic stack, expression evaluation', 5),
('Queue',                    '➡️', '#14B8A6', 'Queue, deque, circular queue, BFS applications', 4),
('Binary Trees',             '🌳', '#10B981', 'Tree traversals, depth, diameter, LCA', 6),
('BST',                      '🌲', '#059669', 'Binary search tree operations, validation, serialization', 5),
('Graphs',                   '🕸️', '#6366F1', 'BFS, DFS, shortest path, topological sort, cycle detection', 6),
('Dynamic Programming',      '💡', '#EF4444', 'Memoization, tabulation, knapsack, subsequences', 7),
('Greedy',                   '🎯', '#F97316', 'Activity selection, scheduling, fractional knapsack', 5),
('Recursion & Backtracking', '🔄', '#A855F7', 'Subsets, permutations, N-Queens, constraint satisfaction', 5),
('Sliding Window',           '🪟', '#06B6D4', 'Fixed and variable window, two-pointer sliding', 4);

-- ─── PROBLEMS (67 — Striver A2Z DSA Sheet) ──────────────────

-- Arrays (topic_id = 1)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Two Sum',                                  'LeetCode',      'Easy',   1, 'https://leetcode.com/problems/two-sum/',                               'O(n)',       'O(n)',   15, 'hashing,brute-force'),
('Best Time to Buy and Sell Stock',          'LeetCode',      'Easy',   1, 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',        'O(n)',       'O(1)',   20, 'greedy,dp'),
('Contains Duplicate',                       'LeetCode',      'Easy',   1, 'https://leetcode.com/problems/contains-duplicate/',                    'O(n)',       'O(n)',   10, 'hashing,sorting'),
('Maximum Subarray (Kadane''s Algorithm)',    'LeetCode',      'Medium', 1, 'https://leetcode.com/problems/maximum-subarray/',                     'O(n)',       'O(1)',   25, 'dp,kadane'),
('Merge Intervals',                          'LeetCode',      'Medium', 1, 'https://leetcode.com/problems/merge-intervals/',                      'O(n log n)', 'O(n)',   30, 'sorting,intervals'),
('Sort Colors (Dutch National Flag)',        'LeetCode',      'Medium', 1, 'https://leetcode.com/problems/sort-colors/',                          'O(n)',       'O(1)',   25, 'two-pointers'),
('Next Permutation',                         'LeetCode',      'Medium', 1, 'https://leetcode.com/problems/next-permutation/',                     'O(n)',       'O(1)',   30, 'math,permutation'),
('Trapping Rain Water',                      'LeetCode',      'Hard',   1, 'https://leetcode.com/problems/trapping-rain-water/',                  'O(n)',       'O(1)',   40, 'two-pointers,stack');

-- Strings (topic_id = 2)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Valid Anagram',                                       'LeetCode', 'Easy',   2, 'https://leetcode.com/problems/valid-anagram/',                                   'O(n)',         'O(1)',         10, 'hashing,sorting'),
('Longest Common Prefix',                               'LeetCode', 'Easy',   2, 'https://leetcode.com/problems/longest-common-prefix/',                           'O(nm)',        'O(1)',         15, 'string'),
('Longest Substring Without Repeating Characters',      'LeetCode', 'Medium', 2, 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',  'O(n)',         'O(min(n,m))',  25, 'sliding-window,hashing'),
('Longest Palindromic Substring',                       'LeetCode', 'Medium', 2, 'https://leetcode.com/problems/longest-palindromic-substring/',                   'O(n²)',        'O(1)',         30, 'dp,expand-center'),
('Group Anagrams',                                      'LeetCode', 'Medium', 2, 'https://leetcode.com/problems/group-anagrams/',                                  'O(nk log k)',  'O(nk)',        25, 'hashing,sorting'),
('Minimum Window Substring',                            'LeetCode', 'Hard',   2, 'https://leetcode.com/problems/minimum-window-substring/',                        'O(n)',         'O(n)',         45, 'sliding-window,hashing');

-- Linked List (topic_id = 3)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Reverse Linked List',          'LeetCode', 'Easy',   3, 'https://leetcode.com/problems/reverse-linked-list/',              'O(n)',   'O(1)', 15, 'recursion,iterative'),
('Middle of the Linked List',    'LeetCode', 'Easy',   3, 'https://leetcode.com/problems/middle-of-the-linked-list/',        'O(n)',   'O(1)', 10, 'two-pointers'),
('Merge Two Sorted Lists',       'LeetCode', 'Easy',   3, 'https://leetcode.com/problems/merge-two-sorted-lists/',           'O(n+m)', 'O(1)', 15, 'recursion'),
('Linked List Cycle',            'LeetCode', 'Easy',   3, 'https://leetcode.com/problems/linked-list-cycle/',                'O(n)',   'O(1)', 15, 'floyd-cycle'),
('Remove Nth Node From End',     'LeetCode', 'Medium', 3, 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'O(n)',   'O(1)', 20, 'two-pointers'),
('Reverse Nodes in k-Group',     'LeetCode', 'Hard',   3, 'https://leetcode.com/problems/reverse-nodes-in-k-group/',         'O(n)',   'O(1)', 45, 'recursion');

-- Stack (topic_id = 4)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Valid Parentheses',                 'LeetCode', 'Easy',   4, 'https://leetcode.com/problems/valid-parentheses/',                 'O(n)', 'O(n)', 10, 'stack'),
('Min Stack',                         'LeetCode', 'Medium', 4, 'https://leetcode.com/problems/min-stack/',                         'O(1)', 'O(n)', 20, 'stack,design'),
('Next Greater Element I',            'LeetCode', 'Easy',   4, 'https://leetcode.com/problems/next-greater-element-i/',             'O(n)', 'O(n)', 20, 'stack,monotonic'),
('Daily Temperatures',                'LeetCode', 'Medium', 4, 'https://leetcode.com/problems/daily-temperatures/',                'O(n)', 'O(n)', 25, 'stack,monotonic'),
('Largest Rectangle in Histogram',    'LeetCode', 'Hard',   4, 'https://leetcode.com/problems/largest-rectangle-in-histogram/',    'O(n)', 'O(n)', 45, 'stack');

-- Queue (topic_id = 5)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Implement Queue using Stacks',  'LeetCode', 'Easy',   5, 'https://leetcode.com/problems/implement-queue-using-stacks/', 'O(1) amortized', 'O(n)', 15, 'stack,queue,design'),
('Sliding Window Maximum',        'LeetCode', 'Hard',   5, 'https://leetcode.com/problems/sliding-window-maximum/',       'O(n)',           'O(k)', 40, 'deque,monotonic'),
('Rotting Oranges',                'LeetCode', 'Medium', 5, 'https://leetcode.com/problems/rotting-oranges/',              'O(mn)',          'O(mn)',30, 'bfs,queue'),
('Design Circular Queue',         'LeetCode', 'Medium', 5, 'https://leetcode.com/problems/design-circular-queue/',        'O(1)',           'O(k)', 25, 'queue,design');

-- Binary Trees (topic_id = 6)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Maximum Depth of Binary Tree',     'LeetCode', 'Easy',   6, 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',            'O(n)', 'O(h)', 10, 'recursion,dfs'),
('Invert Binary Tree',               'LeetCode', 'Easy',   6, 'https://leetcode.com/problems/invert-binary-tree/',                      'O(n)', 'O(h)', 10, 'recursion'),
('Binary Tree Level Order Traversal','LeetCode', 'Medium', 6, 'https://leetcode.com/problems/binary-tree-level-order-traversal/',       'O(n)', 'O(n)', 20, 'bfs,queue'),
('Diameter of Binary Tree',          'LeetCode', 'Easy',   6, 'https://leetcode.com/problems/diameter-of-binary-tree/',                 'O(n)', 'O(h)', 20, 'recursion,dfs'),
('Lowest Common Ancestor',           'LeetCode', 'Medium', 6, 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', 'O(n)', 'O(h)', 25, 'recursion'),
('Binary Tree Maximum Path Sum',     'LeetCode', 'Hard',   6, 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',            'O(n)', 'O(h)', 40, 'recursion,dp');

-- BST (topic_id = 7)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Search in a BST',                  'LeetCode', 'Easy',   7, 'https://leetcode.com/problems/search-in-a-binary-search-tree/',    'O(h)',   'O(h)', 10, 'bst,recursion'),
('Validate Binary Search Tree',      'LeetCode', 'Medium', 7, 'https://leetcode.com/problems/validate-binary-search-tree/',        'O(n)',   'O(h)', 25, 'bst,inorder'),
('Kth Smallest Element in a BST',    'LeetCode', 'Medium', 7, 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',      'O(h+k)', 'O(h)', 20, 'bst,inorder'),
('Delete Node in a BST',             'LeetCode', 'Medium', 7, 'https://leetcode.com/problems/delete-node-in-a-bst/',               'O(h)',   'O(h)', 30, 'bst'),
('Serialize and Deserialize BST',    'LeetCode', 'Medium', 7, 'https://leetcode.com/problems/serialize-and-deserialize-bst/',      'O(n)',   'O(n)', 35, 'bst,preorder');

-- Graphs (topic_id = 8)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Number of Islands',              'LeetCode',      'Medium', 8, 'https://leetcode.com/problems/number-of-islands/',      'O(mn)',  'O(mn)',  25, 'bfs,dfs'),
('Clone Graph',                    'LeetCode',      'Medium', 8, 'https://leetcode.com/problems/clone-graph/',            'O(V+E)', 'O(V)',   25, 'bfs,dfs,hashing'),
('Course Schedule',                'LeetCode',      'Medium', 8, 'https://leetcode.com/problems/course-schedule/',        'O(V+E)', 'O(V+E)',30, 'topological-sort,bfs'),
('Word Ladder',                    'LeetCode',      'Hard',   8, 'https://leetcode.com/problems/word-ladder/',            'O(M²×N)','O(M²×N)',45,'bfs'),
('Dijkstra''s Shortest Path',     'GeeksForGeeks', 'Medium', 8, 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1','O(V²)','O(V)',35,'graph,shortest-path'),
('Detect Cycle in Directed Graph', 'GeeksForGeeks', 'Medium', 8, 'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1',             'O(V+E)','O(V)',30,'dfs,graph');

-- Dynamic Programming (topic_id = 9)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Climbing Stairs',                  'LeetCode',      'Easy',   9, 'https://leetcode.com/problems/climbing-stairs/',                'O(n)',        'O(1)',     10, 'dp,fibonacci'),
('House Robber',                     'LeetCode',      'Medium', 9, 'https://leetcode.com/problems/house-robber/',                   'O(n)',        'O(1)',     20, 'dp'),
('Coin Change',                      'LeetCode',      'Medium', 9, 'https://leetcode.com/problems/coin-change/',                    'O(n×amount)', 'O(amount)',30, 'dp,unbounded-knapsack'),
('Longest Common Subsequence',       'LeetCode',      'Medium', 9, 'https://leetcode.com/problems/longest-common-subsequence/',     'O(mn)',       'O(mn)',    30, 'dp,string'),
('0/1 Knapsack Problem',             'GeeksForGeeks', 'Medium', 9, 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1', 'O(nW)',   'O(nW)',    30, 'dp,knapsack'),
('Longest Increasing Subsequence',   'LeetCode',      'Medium', 9, 'https://leetcode.com/problems/longest-increasing-subsequence/', 'O(n log n)',  'O(n)',     30, 'dp,binary-search'),
('Edit Distance',                    'LeetCode',      'Medium', 9, 'https://leetcode.com/problems/edit-distance/',                  'O(mn)',       'O(mn)',    35, 'dp,string');

-- Greedy (topic_id = 10)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('N Meetings in One Room',     'GeeksForGeeks', 'Easy',   10, 'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1', 'O(n log n)', 'O(1)', 20, 'greedy,sorting'),
('Jump Game',                   'LeetCode',      'Medium', 10, 'https://leetcode.com/problems/jump-game/',                                  'O(n)',       'O(1)', 20, 'greedy'),
('Fractional Knapsack',         'GeeksForGeeks', 'Medium', 10, 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1',    'O(n log n)', 'O(1)', 25, 'greedy,sorting'),
('Job Sequencing Problem',      'GeeksForGeeks', 'Medium', 10, 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1', 'O(n²)',      'O(n)', 30, 'greedy'),
('Minimum Platforms',           'GeeksForGeeks', 'Medium', 10, 'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1',      'O(n log n)', 'O(1)', 25, 'greedy,sorting');

-- Recursion & Backtracking (topic_id = 11)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Subsets',           'LeetCode', 'Medium', 11, 'https://leetcode.com/problems/subsets/',          'O(2^n)',      'O(n)',   20, 'backtracking,recursion'),
('Permutations',      'LeetCode', 'Medium', 11, 'https://leetcode.com/problems/permutations/',     'O(n!)',       'O(n)',   25, 'backtracking'),
('Combination Sum',   'LeetCode', 'Medium', 11, 'https://leetcode.com/problems/combination-sum/',  'O(2^target)', 'O(target)',25,'backtracking'),
('N-Queens',          'LeetCode', 'Hard',   11, 'https://leetcode.com/problems/n-queens/',         'O(n!)',       'O(n²)', 45, 'backtracking'),
('Sudoku Solver',     'LeetCode', 'Hard',   11, 'https://leetcode.com/problems/sudoku-solver/',    'O(9^(n²))',   'O(n²)', 50, 'backtracking');

-- Sliding Window (topic_id = 12)
INSERT INTO problems (title, platform, difficulty, topic_id, problem_url, time_complexity, space_complexity, estimated_time, tags) VALUES
('Maximum Sum Subarray of Size K',          'GeeksForGeeks', 'Easy',   12, 'https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1', 'O(n)', 'O(1)', 15, 'sliding-window'),
('Longest Repeating Character Replacement', 'LeetCode',      'Medium', 12, 'https://leetcode.com/problems/longest-repeating-character-replacement/',  'O(n)', 'O(1)', 25, 'sliding-window'),
('Permutation in String',                   'LeetCode',      'Medium', 12, 'https://leetcode.com/problems/permutation-in-string/',                    'O(n)', 'O(1)', 25, 'sliding-window,hashing'),
('Subarrays with K Different Integers',     'LeetCode',      'Hard',   12, 'https://leetcode.com/problems/subarrays-with-k-different-integers/',      'O(n)', 'O(k)', 45, 'sliding-window');

-- ─── BADGES (10) ─────────────────────────────────────────────
INSERT INTO badges (badge_name, description, icon, criteria, badge_type) VALUES
('First Blood',     'Solve your first problem',              '🏆', 'solved >= 1',      'problems'),
('Getting Started', 'Solve 10 problems',                     '🌟', 'solved >= 10',     'problems'),
('Problem Crusher', 'Solve 50 problems',                     '💪', 'solved >= 50',     'problems'),
('Centurion',       'Solve 100 problems',                    '🎯', 'solved >= 100',    'problems'),
('Streak Starter',  'Maintain a 3-day streak',               '🔥', 'streak >= 3',      'streak'),
('Streak Master',   'Maintain a 7-day streak',               '⚡', 'streak >= 7',      'streak'),
('Streak Legend',   'Maintain a 30-day streak',              '👑', 'streak >= 30',     'streak'),
('Contest Warrior', 'Participate in 5 contests',             '⚔️', 'contests >= 5',    'contest'),
('Topic Explorer',  'Solve problems in 5 different topics',  '🗺️', 'topics >= 5',      'topic'),
('Hard Hitter',     'Solve 10 hard-level problems',          '💎', 'hard_solved >= 10','problems');

-- ─── DEMO USERS ──────────────────────────────────────────────
-- admin123 hashed with bcrypt
INSERT INTO users (username, email, password_hash, full_name, role, current_streak, max_streak, total_solved) VALUES
('admin', 'admin@dsatracker.com', '$2b$10$EpRnTzVlqHQCFo7oXN6Lle0y0FeGuhtHY1wMqFpPPGXbMM2MlGSPS', 'Admin User',  'admin', 5, 12, 35),
('demo',  'demo@dsatracker.com',  '$2b$10$Y6F4e5JAkR3g0PHPGaXvwOvqRjBE6Y7yZfjF0pWfY0.I0X4fML2NC',  'Demo Student', 'user',  3, 7,  22);

-- ─── SAMPLE SUBMISSIONS (for demo user, user_id=2) ──────────
INSERT INTO submissions (user_id, problem_id, status, time_taken_min, approach_used, language_used, attempts, confidence, submitted_at) VALUES
(2, 1,  'Accepted',     12, 'HashMap approach',             'Python',     1, 5, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 2,  'Accepted',     15, 'Single pass with min tracking','Java',       1, 4, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 3,  'Accepted',     8,  'HashSet',                      'Python',     1, 5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 4,  'Accepted',     20, 'Kadane''s algorithm',           'C++',        2, 4, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 5,  'Accepted',     25, 'Sort then merge overlapping',  'Python',     1, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 9,  'Accepted',     8,  'Frequency count',              'Java',       1, 5, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 10, 'Accepted',     10, 'Character by character',       'Python',     1, 4, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 15, 'Accepted',     10, 'Iterative reversal',           'C++',        1, 5, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 16, 'Accepted',     8,  'Slow and fast pointers',       'Python',     1, 5, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 21, 'Accepted',     7,  'Stack-based matching',         'Java',       1, 5, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 25, 'Accepted',     12, 'BFS with queue',               'Python',     2, 4, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 29, 'Accepted',     8,  'Recursive DFS',                'C++',        1, 5, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 30, 'Accepted',     7,  'Recursive swap',               'Python',     1, 5, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 35, 'Accepted',     8,  'Recursive search',             'Java',       1, 5, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 40, 'Accepted',     18, 'DFS/BFS flood fill',           'Python',     1, 4, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(2, 46, 'Accepted',     8,  'Fibonacci approach',           'C++',        1, 5, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(2, 47, 'Accepted',     15, 'DP with prev/curr',            'Python',     1, 4, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 53, 'Accepted',     12, 'Sort by finish time',          'Java',       1, 4, DATE_SUB(NOW(), INTERVAL 11 DAY)),
(2, 58, 'Accepted',     15, 'Backtracking template',        'Python',     1, 4, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 64, 'Accepted',     10, 'Fixed size window',            'C++',        1, 5, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(2, 8,  'Wrong Answer', 35, 'Two pointer attempt',          'Python',     3, 2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 14, 'TLE',          40, 'Brute force O(n³)',            'Java',       2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ─── SAMPLE CONTESTS (for demo user) ────────────────────────
INSERT INTO contests (user_id, contest_name, platform, rank_achieved, score, total_problems, solved_count, contest_date, contest_url) VALUES
(2, 'Weekly Contest 380',   'LeetCode',    1245, 12, 4, 2, '2025-01-12', 'https://leetcode.com/contest/weekly-contest-380/'),
(2, 'Biweekly Contest 120', 'LeetCode',    890,  18, 4, 3, '2025-01-26', 'https://leetcode.com/contest/biweekly-contest-120/'),
(2, 'Starters 168',         'CodeChef',    2300, 400,5, 3, '2025-02-07', 'https://www.codechef.com/START168'),
(2, 'Codeforces Round 920', 'Codeforces',  3500, 1200,6,2, '2025-02-15', 'https://codeforces.com/contest/1920'),
(2, 'Weekly Contest 385',   'LeetCode',    760,  18, 4, 3, '2025-03-01', 'https://leetcode.com/contest/weekly-contest-385/');

-- ─── SAMPLE NOTES ────────────────────────────────────────────
INSERT INTO notes (user_id, problem_id, content, key_insight, approach) VALUES
(2, 1,  'Use a hash map to store complement values. For each number, check if target - num exists in the map.',
        'HashMap reduces O(n²) to O(n)',
        '1. Create empty hashmap\n2. For each num, check if (target-num) in map\n3. If yes return indices, else store num:index'),
(2, 4,  'Kadane''s Algorithm: maintain current_sum and max_sum. Reset current_sum to 0 if it goes negative.',
        'Reset running sum when it becomes negative',
        'Initialize max_sum = nums[0], curr = 0. For each num: curr = max(num, curr+num), max_sum = max(max_sum, curr)'),
(2, 8,  'Two pointer approach: left=0, right=n-1. Track maxLeft and maxRight. Process the smaller side.',
        'Process from the side with smaller boundary',
        'Two pointers from both ends, track left_max and right_max, add water from smaller side'),
(2, 15, 'Three approaches: iterative (prev/curr swap), recursive, and stack-based.',
        'Draw the pointer manipulation on paper first',
        'Iterative: prev=null, curr=head. While curr: save next, curr.next=prev, prev=curr, curr=next'),
(2, 21, 'Use a stack. Push opening brackets, pop on closing. Check if popped matches.',
        'Map closing brackets to their opening counterparts',
        'Create map: )→(, ]→[, }→{. Push opens, on close check stack top matches'),
(2, 40, 'BFS/DFS on grid. Mark visited cells. Count connected components of ''1''s.',
        'Treat grid as implicit graph',
        'For each unvisited ''1'', run BFS/DFS to mark all connected ''1''s, increment island count'),
(2, 46, 'Classic DP. f(n) = f(n-1) + f(n-2). Can optimize space to O(1) with two variables.',
        'Same as Fibonacci sequence',
        'Base: f(1)=1, f(2)=2. For i=3..n: f(i) = f(i-1)+f(i-2). Track only last two values'),
(2, 48, 'DP with amount+1 array. For each coin, update dp[i] = min(dp[i], dp[i-coin]+1).',
        'Unbounded knapsack variant',
        'dp[0]=0, dp[1..amount]=INF. For each coin: for i=coin..amount: dp[i]=min(dp[i], dp[i-coin]+1)'),
(2, 58, 'Backtracking template: choose, explore, unchoose. Build subsets incrementally.',
        'Include/exclude pattern for power set',
        'Recursive: at each index, include current element and recurse, then exclude and recurse'),
(2, 5,  'Sort intervals by start time. Merge if current overlaps with previous.',
        'Sorting is the key first step',
        'Sort by start. For each interval: if overlaps with last merged, extend end. Else add new.');

-- ─── SAMPLE USER_STATS (past 30 days for demo user) ─────────
INSERT INTO user_stats (user_id, stat_date, problems_solved, time_spent_min, submissions_count) VALUES
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY),  2, 27, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 2 DAY),  3, 63, 4),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY),  2, 33, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 4 DAY),  2, 18, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  2, 22, 3),
(2, DATE_SUB(CURDATE(), INTERVAL 6 DAY),  2, 20, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 7 DAY),  1, 7,  1),
(2, DATE_SUB(CURDATE(), INTERVAL 8 DAY),  1, 8,  1),
(2, DATE_SUB(CURDATE(), INTERVAL 9 DAY),  2, 26, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1, 15, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 11 DAY), 1, 12, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 1, 15, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 13 DAY), 1, 10, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 16 DAY), 1, 20, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 2, 35, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 1, 15, 1),
(2, DATE_SUB(CURDATE(), INTERVAL 22 DAY), 1, 10, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 25 DAY), 2, 30, 2),
(2, DATE_SUB(CURDATE(), INTERVAL 28 DAY), 1, 20, 1);

-- ─── SAMPLE PROGRESS (demo user across all 12 topics) ───────
INSERT INTO progress (user_id, topic_id, solved_count, total_count, percentage, last_practiced) VALUES
(2, 1,  5, 8,  62.50, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 2,  3, 6,  50.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 3,  3, 6,  50.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 4,  1, 5,  20.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 5,  1, 4,  25.00, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 6,  2, 6,  33.33, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 7,  1, 5,  20.00, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 8,  1, 6,  16.67, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(2, 9,  3, 7,  42.86, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(2, 10, 1, 5,  20.00, DATE_SUB(NOW(), INTERVAL 11 DAY)),
(2, 11, 1, 5,  20.00, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 12, 1, 4,  25.00, DATE_SUB(NOW(), INTERVAL 13 DAY));

-- ─── SAMPLE ACHIEVEMENTS (demo user) ────────────────────────
INSERT INTO achievements (user_id, badge_id, earned_at) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 13 DAY)),  -- First Blood
(2, 2, DATE_SUB(NOW(), INTERVAL 9 DAY)),   -- Getting Started (10 solved)
(2, 5, DATE_SUB(NOW(), INTERVAL 5 DAY)),   -- Streak Starter (3-day)
(2, 9, DATE_SUB(NOW(), INTERVAL 6 DAY)),   -- Topic Explorer (5+ topics)
(2, 6, DATE_SUB(NOW(), INTERVAL 1 DAY));   -- Streak Master (7-day)

-- Admin user achievements
INSERT INTO achievements (user_id, badge_id, earned_at) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 2, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 5, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 6, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 8, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 9, DATE_SUB(NOW(), INTERVAL 8 DAY));

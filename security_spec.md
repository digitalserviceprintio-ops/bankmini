# Security Specification for Tabungan Cilik SD

## 1. Data Invariants
- Admin accounts must have valid string usernames and school names.
- School profiles belong to an admin and require valid schoolName, address, and academic year.
- Students must belong to an admin, have unique NIS within the school, valid names (1-100 characters), positive or zero balance.
- Transactions must have a valid amount > 0, valid type ('deposit' or 'withdraw'), matching student reference, and immutable audit timestamps.
- Withdrawals cannot exceed the existing balance.
- Class lists must be bounded arrays of string class identifiers.

## 2. The Dirty Dozen Payloads
1. Negative deposit amount ({ type: 'deposit', amount: -50000 }) -> REJECT
2. Zero amount transaction ({ type: 'deposit', amount: 0 }) -> REJECT
3. Withdrawal exceeding balance ({ type: 'withdraw', amount: 999999999, previousBalance: 10000 }) -> REJECT
4. Overly long student name (> 200 characters) -> REJECT
5. Invalid transaction type ({ type: 'unknown_type' }) -> REJECT
6. Missing required NIS or Account Number -> REJECT
7. Modifying immutable transaction record -> REJECT
8. Injecting unexpected ghost fields into student record -> REJECT
9. Poisoned document IDs with script tags or path traversal -> REJECT
10. Unbounded class array (> 100 classes) -> REJECT
11. Fake balance tampering on student document -> REJECT
12. Blank string for school name -> REJECT

## 3. Test Runner
Verification via security rules syntax and schema checks.

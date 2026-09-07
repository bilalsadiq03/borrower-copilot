# Rules, Thresholds and Assumptions

This document is the source-of-truth for the decision rules used by
Borrower Copilot.

The purpose is transparency: a reviewer or borrower should be able to
see **what the system assumes, why it uses the assumption, and whether
the value is externally sourced or a product judgement**.

> **Important:** Unless a row explicitly identifies an external source,
> the value is a product assumption / **my judgement** for this
> prototype. These rules are not lender underwriting policies.

## 1. Borrowing Decision and Affordability

  -----------------------------------------------------------------------
  What              Value             Why               Source / basis
  ----------------- ----------------- ----------------- -----------------
  Borrower-safe EMI Conservative      Protects monthly  My judgement
  / net income      FOIR-style        cash-flow buffer  
  ceiling           ceiling           rather than       
                    implemented by    maximizing        
                    the engine        borrowing         

  Lender-style FOIR Higher than the   Demonstrates the  My judgement /
  ceiling           borrower-safe     difference        prototype
                    ceiling           between likely    assumption
                                      lender capacity   
                                      and safer         
                                      borrower capacity 

  Existing EMI      Existing EMI is   Existing          My judgement
  treatment         counted before    obligations       
                    assessing new     already consume   
                    borrowing         monthly cash flow 
                    capacity                            

  Household         Deducted from     A borrower needs  My judgement
  expenses          income when       a living-expense  
                    determining       buffer in         
                    borrower-safe     addition to debt  
                    capacity          capacity          

  Don't Borrow      Triggered when    A self-assessment My judgement
  condition         the requested     must allow a      
                    borrowing would   genuine negative  
                    leave             recommendation    
                    insufficient                        
                    affordability or                    
                    fails the stress                    
                    test                                

  Borrow Less       Used when the     Gives the         My judgement
  condition         requested amount  borrower an       
                    is above the      actionable middle 
                    safer amount but  option            
                    some borrowing                      
                    remains                             
                    affordable                          
  -----------------------------------------------------------------------

> The exact numerical thresholds should always be read from the
> implementation in `lib/rules/` if they change. The code is the
> executable source; this document records the rationale.

## 2. Loan Amount Estimation

  -----------------------------------------------------------------------
  What              Value             Why               Source / basis
  ----------------- ----------------- ----------------- -----------------
  Borrower-safe     Derived from safe Converts monthly  My judgement
  amount            EMI capacity,     affordability     
                    rate and tenure   into a            
                                      conservative      
                                      principal range   

  Likely lender     Derived using a   Models what a     My judgement
  amount            less conservative lender may        
                    lender-style      potentially       
                    affordability     sanction without  
                    assumption        presenting it as  
                                      approval          

  Lender amount vs  Intentionally     A lender may      Challenge
  safe amount       separate          accept a higher   requirement + my
                                      debt burden than  judgement
                                      the borrower      
                                      should choose     

  Requested amount  User-provided     The decision must User input
                                      compare the       
                                      request with both 
                                      capacity          
                                      estimates         

  Range output      Amounts are       Avoids false      Challenge
                    presented as      precision         requirement + my
                    ranges where                        judgement
                    uncertainty                         
                    exists                              
  -----------------------------------------------------------------------

## 3. Fair Interest Rate

  ------------------------------------------------------------------------
  What              Value              Why               Source / basis
  ----------------- ------------------ ----------------- -----------------
  Fair rate         Product-specific   A borrower should My judgement
                    indicative band    compare a lender  
                                       quote against a   
                                       reasonable range, 
                                       not one           
                                       artificial number 

  Rate adjustment   Lower end of       Stronger          My judgement
  for stronger      applicable band    demonstrated      
  credit                               credit history    
                                       can reduce        
                                       perceived credit  
                                       risk              

  Rate adjustment   Wider / less       Unknown credit    My judgement
  for unknown       favorable range    information       
  credit                               increases         
                                       uncertainty       

  Rate adjustment   More stable income Stability affects My judgement
  for income        can support a      repayment-risk    
  stability         tighter / more     assessment        
                    favorable range                      

  Rate adjustment   Higher / wider     Recent bounces    My judgement
  for high-risk     range              and expensive     
  signals                              existing debt     
                                       indicate          
                                       repayment stress  

  Secured-product   Secured routes can Collateral        My judgement
  treatment         use a different    changes product   
                    rate band from     risk and route    
                    unsecured personal                   
                    borrowing                            
  ------------------------------------------------------------------------

## 4. APR and Loan Cost

  ---------------------------------------------------------------------------------
  What              Value             Why               Source / basis
  ----------------- ----------------- ----------------- ---------------------------
  APR method        Cash-flow IRR     Captures the cost Implemented method in
                    converted to      of upfront fees   `lib/calculations/apr.ts`
                    effective annual  relative to the   
                    rate              amount actually   
                                      received          

  Processing fee    Applied to        Processing fees   My judgement / offer input
                    principal         reduce the net    
                    according to the  amount received   
                    product/offer     or increase total 
                    representation    borrowing cost    

  Upfront charges   Included when     Borrower needs an Implemented method
                    supplied          all-in cost       
                                      rather than an    
                                      interest-only     
                                      comparison        

  APR display       Approximate /     Actual lender     My judgement
                    indicative        disclosure can    
                                      depend on         
                                      lender-specific   
                                      fee and cash-flow 
                                      conventions       

  Zero monthly      Handled           Required for      Engineering requirement
  interest edge     separately to     numerical         
  case              avoid division by correctness       
                    zero                                
  ---------------------------------------------------------------------------------

The application should describe this as **approximate all-in APR**, not
as an official lender APR.

## 5. Safe EMI and Tenure

  ------------------------------------------------------------------------
  What              Value              Why               Source / basis
  ----------------- ------------------ ----------------- -----------------
  Safe EMI ceiling  Derived from       The borrower      My judgement
                    borrower           needs a ceiling   
                    affordability      they should not   
                                       cross             

  Existing EMI      Included in        New EMI is not    My judgement
                    current debt       the only          
                    burden             obligation        

  Tenure            Product/borrower   EMI depends on    User input /
                    input or           tenure            documented
                    documented default                   product
                                                         assumption

  Longer tenure     Lower EMI but      Makes the         Mathematical
                    higher total       trade-off visible property of
                    interest                             amortizing loans

  Stress-tested EMI Recalculated under Tests resilience  My judgement
                    adverse            rather than only  
                    assumptions        current           
                                       affordability     
  ------------------------------------------------------------------------

## 6. Stress Testing

  -----------------------------------------------------------------------
  What              Value             Why               Source / basis
  ----------------- ----------------- ----------------- -----------------
  Income stress     Income reduction  Tests whether     My judgement
                    scenario          repayment remains 
                    implemented by    manageable after  
                    the engine        an income shock   

  Rate stress       Interest-rate     Tests rate        My judgement
                    increase scenario sensitivity       
                    where applicable                    

  Stress result     Shows changed     Makes downside    Challenge
                    debt burden /     risk visible to   requirement
                    affordability     the borrower      

  Stress failure    Can push a        A loan that works My judgement
                    recommendation    only in the best  
                    toward Borrow     case is less      
                    Less or Don't     resilient         
                    Borrow                              
  -----------------------------------------------------------------------

The app must display the actual stress assumption used rather than
hiding it.

## 7. Confidence and Missing Information

  -------------------------------------------------------------------------
  What              Value               Why               Source / basis
  ----------------- ------------------- ----------------- -----------------
  High confidence   Most                More information  My judgement
                    decision-critical   supports narrower 
                    inputs are          estimates         
                    available                             

  Medium confidence Some relevant       Estimates remain  My judgement
                    inputs are missing  usable but less   
                                        certain           

  Low confidence    Several important   Results should be My judgement
                    inputs are missing  treated           
                                        cautiously        

  Unknown credit    Remains unknown     Unknown           Challenge
  score                                 information must  requirement
                                        not be converted  
                                        into an invented  
                                        score             

  Missing income    Reduces confidence  Avoids false      Challenge
  detail            / widens relevant   precision         requirement
                    estimates                             

  Missing savings / Does not            Zero and unknown  Challenge
  collateral /      automatically       represent         requirement
  tenure            become zero         different states  
  information                                             
  -------------------------------------------------------------------------

## 8. Product Routing

  ------------------------------------------------------------------------
  What              Value             Why                Source / basis
  ----------------- ----------------- ------------------ -----------------
  Personal loan     Unsecured         Appropriate for    Product modelling
                    consumer route    eligible general   assumption
                                      personal borrowing 

  Home loan         Secured           Product differs    Product modelling
                    property-backed   materially from    assumption
                    route             unsecured          
                                      borrowing          

  LAP / secured     Considered when   Ravi's collateral  Challenge
  business route    relevant          makes this route   persona + my
                    collateral is     materially         judgement
                    available         relevant           

  Gold loan         Secured route     Different security Product modelling
                    when relevant     and pricing        assumption
                    gold collateral   structure          
                    is available                         

  Two-wheeler loan  Relevant for      Purpose-specific   Product modelling
                    vehicle purchase  financing can      assumption
                                      differ from        
                                      personal borrowing 

  Business loan     Relevant for      Business purpose   Product modelling
                    productive        and cash flow can  assumption
                    business use      change product fit 
  ------------------------------------------------------------------------

The system recommends a route; it does not claim that a lender will
approve it.

## 9. Risk Signals

  -----------------------------------------------------------------------
  What              Value             Why               Source / basis
  ----------------- ----------------- ----------------- -----------------
  Recent EMI bounce Negative risk     Indicates recent  My judgement
                    signal            repayment stress  

  Multiple          Negative risk     Indicates         My judgement
  high-cost app     signal            existing debt     
  loans                               pressure and      
                                      expensive         
                                      borrowing         

  Stable salaried   Positive          More predictable  My judgement
  employment        stability signal  income can        
                                      improve           
                                      affordability     
                                      confidence        

  Long business     Positive          Operating history My judgement
  tenure            stability signal  provides evidence 
                                      of continuity     

  No formal credit  Uncertain rather  Lack of history   My judgement
  history           than              is different from 
                    automatically bad proven repayment  
                                      failure           

  Unencumbered      Positive route    Can support       My judgement
  collateral        signal            consideration of  
                                      a secured product 
  -----------------------------------------------------------------------

## 10. Additional Question Value

Every additional question must have a reason to exist.

  -----------------------------------------------------------------------
  Question / signal       Output it can affect    Why
  ----------------------- ----------------------- -----------------------
  Employment tenure       Rate, confidence,       Helps assess income
                          amount                  stability

  Business tenure         Rate, confidence,       Helps assess business
                          product route           continuity

  Income stability        Rate, confidence,       Distinguishes stable
                          amount                  and volatile income

  Variable income share   Amount, stress,         Volatility affects safe
                          confidence              capacity

  Credit utilization      Rate, risk, confidence  Helps characterize
                                                  current credit pressure

  EMI bounce history      Decision, rate, stress  Recent repayment stress
                                                  matters

  Emergency savings       Decision, safe amount,  Provides resilience
                          confidence              against shocks

  Collateral              Product route, lender   Can support secured
                          estimate, rate          borrowing

  Upcoming large expense  Safe amount, decision   Future cash-flow needs
                                                  reduce available buffer

  Productive use /        Decision, amount,       A productive purpose
  expected return         explanation             may change the
                                                  value/risk discussion

  Existing offer          APR comparison, rate    Helps borrower compare
                          explanation             a real quote against
                                                  the self-assessment
  -----------------------------------------------------------------------

If an additional question does not change an output or confidence, it
should not be included merely to collect information.

## 11. What the System Knows

The system can use:

-   information explicitly supplied by the borrower;
-   deterministic calculations;
-   documented product assumptions;
-   documented rule thresholds;
-   stress scenarios;
-   the borrower's stated obligations and income.

## 12. What the System Does Not Know

The system does not independently know:

-   actual bureau data;
-   lender-specific underwriting rules;
-   verified bank statements;
-   verified income documents;
-   actual lender approval probability;
-   lender-specific risk models;
-   exact collateral valuation;
-   future income or expense changes;
-   future interest rates;
-   all lender fees unless entered.

## 13. Important Limitations

Borrower Copilot is intentionally a transparent prototype.

It does not attempt to reproduce a bank's or NBFC's underwriting model.
The numbers are intended to help a borrower ask better questions and
compare offers.

The system should never represent an estimate as a sanction, approval,
guarantee or official lender quote.

## 14. Change Management

When a threshold or assumption changes:

1.  Update the executable rule in `lib/rules/`.
2.  Update this document.
3.  Run the relevant tests.
4.  Re-run the three challenge personas.
5.  Update `RUNTHROUGHS.md` if the outputs change.

This keeps the code, explanation and demonstration aligned.

import React, { useState, useEffect } from 'react';

const HomePurchase1 = () => {
  // Property type selection
  const [propertyType, setPropertyType] = useState('median-single-family');
  //financial status
const [financialCase, setFinancialCase] = useState('20-down-rent');

// State object to store financial values per case
const [financialValues, setFinancialValues] = useState({
  paysRent: true,
});
  
  // March 2024 scenario inputs
  const [homePriceMarch2024, setHomePriceMarch2024] = useState(650000); // Median Miami single-family home price Q1 2024
  const [downPaymentPercentMarch2024, setDownPaymentPercentMarch2024] = useState(20);
  const [mortgageRateMarch2024, setMortgageRateMarch2024] = useState(6.8);
  const [mortgageTermMarch2024, setMortgageTermMarch2024] = useState(30);
  const [showCashFlow, setShowCashFlow] = useState(false);
  
  // March 2025 scenario inputs
  const [homePriceAppreciationPercent, setHomePriceAppreciationPercent] = useState(6.2);
  const [homePriceMarch2025, setHomePriceMarch2025] = useState(690000);
  const [downPaymentPercentMarch2025, setDownPaymentPercentMarch2025] = useState(20);
  const [mortgageRateMarch2025, setMortgageRateMarch2025] = useState(6.2);
  const [mortgageTermMarch2025, setMortgageTermMarch2025] = useState(30);
  
  // Costs during waiting period
  const [monthlyRent, setMonthlyRent] = useState(2850); // Median rent for comparable property
  const [investmentReturnRate, setInvestmentReturnRate] = useState(6.8);
  
  // Additional costs
  const [annualPropertyTaxRate, setAnnualPropertyTaxRate] = useState(1.05);
  const [annualHomeInsurance, setAnnualHomeInsurance] = useState(4480); // 0.8% of home value for Miami
  const [monthlyHOA, setMonthlyHOA] = useState(0); // 0 for single-family, higher for condos
  const [annualMaintenance, setAnnualMaintenance] = useState(5600); // 1% of home value
  const [closingCostsPercent, setClosingCostsPercent] = useState(3);
  
  // Auto-calculation flags
  const [autoCalculateInsurance, setAutoCalculateInsurance] = useState(true);
  const [autoCalculateMaintenance, setAutoCalculateMaintenance] = useState(true);
  const [autoCalculateRent, setAutoCalculateRent] = useState(true);

  
  
  // Results
  const [results, setResults] = useState({
    march2024: {
      totalCost: 0,
      equity: 0,
      netPosition: 0
    },
    march2025: {
      totalCost: 0,
      investmentReturns: 0,
      equity:0,
      netPosition: 0
    },
    difference: 0,
    recommendation: ''
  });

  //cash flow results
  const [cashFlowResults, setCashFlowResults] = useState({
    march2024: {
      initialInvestment: {
        downPayment: 0,
        closingCosts: 0,
        totalInitialCashOutflow: 0
      },
      monthlyOutflow: {
        mortgagePI: 0,
        propertyTax: 0,
        insurance: 0,
        hoa: 0,
        maintenance: 0,
        totalMonthly: 0,
        totalFor12Months: 0
      },
      assetValue: {
        initialValue: 0,
        valueAfter12Months: 0,
        appreciation: 0,
        principalPaid: 0,
        totalEquityGained: 0
      },
      cashEfficiency: {
        totalCashInvested: 0,
        totalValueGained: 0,
        cashEfficiencyRatio: 0,
        netCashPosition: 0
      },
      opportunityCost: {
        potentialInvestmentReturns: 0,
        netAfterOpportunityCost: 0
      }
    },
    march2025: {
      prePurchasePeriod: {
        totalRentPaid: 0,
        investmentReturns: 0,
        netPrePurchasePosition: 0
      },
      purchaseCosts: {
        downPayment: 0,
        closingCosts: 0,
        totalPurchaseCosts: 0
      },
      totalPosition: {
        totalCashSpent: 0,
        investmentReturns: 0,
        netCashPosition: 0,
        netCashPositionNoRent: 0,
      },
      cashEfficiency: {
        totalCashInvested: 0,
        totalCashInvestedNoRent: 0,
        totalValueGained: 0,
        cashEfficiencyRatio: 0
      }
    },
    comparison: {
      difference: 0,
      recommendation: ''
    }
  });

  // Update March 2025 home price when appreciation changes
  useEffect(() => {
    const newPrice = homePriceMarch2024 * (1 + homePriceAppreciationPercent / 100);
  setHomePriceMarch2025(Math.round(newPrice));
  }, [homePriceMarch2024, homePriceAppreciationPercent]);

  //normal calculation function
  const calculateResults = () => {
    // Calculate down payments
    const downPaymentMarch2024 = homePriceMarch2024 * (downPaymentPercentMarch2024 / 100);
    const downPaymentMarch2025 = homePriceMarch2025 * (downPaymentPercentMarch2025 / 100);
    
    // Calculate loan amounts
    const loanAmountMarch2024 = homePriceMarch2024 - downPaymentMarch2024;
    const loanAmountMarch2025 = homePriceMarch2025 - downPaymentMarch2025;
    
    // Calculate monthly mortgage payments
    const monthlyInterestRateMarch2024 = mortgageRateMarch2024 / 100 / 12;
    const numberOfPaymentsMarch2024 = mortgageTermMarch2024 * 12;
    const monthlyMortgagePaymentMarch2024 = loanAmountMarch2024 * 
      (monthlyInterestRateMarch2024 * Math.pow(1 + monthlyInterestRateMarch2024, numberOfPaymentsMarch2024)) / 
      (Math.pow(1 + monthlyInterestRateMarch2024, numberOfPaymentsMarch2024) - 1);
    
    const monthlyInterestRateMarch2025 = mortgageRateMarch2025 / 100 / 12;
    const numberOfPaymentsMarch2025 = mortgageTermMarch2025 * 12;
    const monthlyMortgagePaymentMarch2025 = loanAmountMarch2025 * 
      (monthlyInterestRateMarch2025 * Math.pow(1 + monthlyInterestRateMarch2025, numberOfPaymentsMarch2025)) / 
      (Math.pow(1 + monthlyInterestRateMarch2025, numberOfPaymentsMarch2025) - 1);
    
    // Calculate monthly property tax
    const monthlyPropertyTaxMarch2024 = (homePriceMarch2024 * (annualPropertyTaxRate / 100)) / 12;
    const monthlyPropertyTaxMarch2025 = (homePriceMarch2025 * (annualPropertyTaxRate / 100)) / 12;
    
    // Calculate monthly insurance
    const monthlyInsurance = annualHomeInsurance / 12;
    
    // Calculate total monthly payment (PITI + HOA)
    const totalMonthlyPaymentMarch2024 = monthlyMortgagePaymentMarch2024 + monthlyPropertyTaxMarch2024 + monthlyInsurance + monthlyHOA;
    const totalMonthlyPaymentMarch2025 = monthlyMortgagePaymentMarch2025 + monthlyPropertyTaxMarch2025 + monthlyInsurance + monthlyHOA;
    
    // Calculate total payments over the waiting period (12 months instead of 13)
    const totalPaymentsMarch2024 = totalMonthlyPaymentMarch2024 * 12;
    
    // Calculate principal paid during the waiting period (12 months instead of 13)
    const principalPaidMarch2024 = calculatePrincipalPaid(loanAmountMarch2024, monthlyInterestRateMarch2024, monthlyMortgagePaymentMarch2024, 12);
    
    // Calculate home equity after waiting period
    const equityMarch2024 = downPaymentMarch2024 + principalPaidMarch2024 + (homePriceMarch2025 - homePriceMarch2024);
    
    // Calculate total rent paid (12 months instead of 13)
    const totalRentPaid = monthlyRent * 12;
    
    // Calculate investment returns on down payment (12 months instead of 13/12)
    const investmentReturns = downPaymentMarch2025 * (investmentReturnRate / 100);
    
    // Calculate closing costs for both scenarios
    const closingCostsMarch2024 = homePriceMarch2024 * (closingCostsPercent / 100);
    const closingCostsMarch2025 = homePriceMarch2025 * (closingCostsPercent / 100);
    
    // Calculate maintenance costs avoided (12 months instead of 13/12)
    const maintenanceAvoided = annualMaintenance;
    
    // Calculate net position for each scenario
    const march2024NetPosition = equityMarch2024 - totalPaymentsMarch2024 - closingCostsMarch2024 - annualMaintenance;
    const march2025NetPosition =  downPaymentMarch2025 + investmentReturns - totalRentPaid - closingCostsMarch2025;
    
    // Calculate difference
    const difference = march2025NetPosition - march2024NetPosition;
    
    // Determine recommendation
    const recommendation = difference > 0 
      ? "Waiting to purchase was financially advantageous."
      : "Purchasing in March 2024 would have been better financially.";
    
    setResults({
      march2024: {
        totalCost: Math.round(totalPaymentsMarch2024 + closingCostsMarch2024 + maintenanceAvoided),
        equity: Math.round(equityMarch2024),
        netPosition: Math.round(march2024NetPosition)
      },
      march2025: {
        totalCost: Math.round(totalRentPaid + closingCostsMarch2025),
        investmentReturns: Math.round(investmentReturns),
        equity: Math.round(downPaymentMarch2025),
        netPosition: Math.round(march2025NetPosition)
      },
      difference: Math.round(difference),
      recommendation: recommendation
    });
  };
  
  //cash flow calculation function
  const calculateCashFlowResults = () => {
    // ========== MARCH 2024 PURCHASE SCENARIO ==========
  
    // Initial Cash Outflow
    const CFA_march2024_downPayment = homePriceMarch2024 * (downPaymentPercentMarch2024 / 100);
    const CFA_march2024_closingCosts = homePriceMarch2024 * (closingCostsPercent / 100);
    const CFA_march2024_totalInitialCashOutflow = CFA_march2024_downPayment + CFA_march2024_closingCosts;
  
    // Calculate loan amount
    const CFA_march2024_loanAmount = homePriceMarch2024 - CFA_march2024_downPayment;
  
    // Calculate monthly mortgage payment
    const CFA_march2024_monthlyInterestRate = mortgageRateMarch2024 / 100 / 12;
    const CFA_march2024_numberOfPayments = mortgageTermMarch2024 * 12;
    const CFA_march2024_monthlyMortgagePI = CFA_march2024_loanAmount * 
      (CFA_march2024_monthlyInterestRate * Math.pow(1 + CFA_march2024_monthlyInterestRate, CFA_march2024_numberOfPayments)) / 
      (Math.pow(1 + CFA_march2024_monthlyInterestRate, CFA_march2024_numberOfPayments) - 1);
  
    // Monthly Cash Outflow
    const CFA_march2024_monthlyPropertyTax = (homePriceMarch2024 * (annualPropertyTaxRate / 100)) / 12;
    const CFA_march2024_monthlyInsurance = annualHomeInsurance / 12;
    const CFA_march2024_monthlyMaintenance = annualMaintenance / 12;
    const CFA_march2024_monthlyTotalPayment = CFA_march2024_monthlyMortgagePI + CFA_march2024_monthlyPropertyTax + 
      CFA_march2024_monthlyInsurance + monthlyHOA + CFA_march2024_monthlyMaintenance;
    const CFA_march2024_totalPayments12Months = CFA_march2024_monthlyTotalPayment * 12;
  
    // Calculate principal paid during the waiting period
    const CFA_march2024_principalPaid = calculatePrincipalPaid(
      CFA_march2024_loanAmount, 
      CFA_march2024_monthlyInterestRate, 
      CFA_march2024_monthlyMortgagePI, 
      12
    );
  
    // Asset Value Changes
    const CFA_march2024_initialHomeValue = homePriceMarch2024;
    const CFA_march2024_homeValueAfter12Months = homePriceMarch2025; // Using the March 2025 value
    const CFA_march2024_homeAppreciation = CFA_march2024_homeValueAfter12Months - CFA_march2024_initialHomeValue;
    const CFA_march2024_totalEquityGained = CFA_march2024_homeAppreciation + CFA_march2024_principalPaid;
  
    // Cash Efficiency Metrics
    const CFA_march2024_totalCashInvested = CFA_march2024_totalInitialCashOutflow + CFA_march2024_totalPayments12Months;
    const CFA_march2024_totalValueGained = CFA_march2024_downPayment + CFA_march2024_principalPaid + CFA_march2024_homeAppreciation;
    const CFA_march2024_cashEfficiencyRatio = CFA_march2024_totalValueGained / CFA_march2024_totalCashInvested;
    const CFA_march2024_netCashPosition = CFA_march2024_totalValueGained - CFA_march2024_totalCashInvested;
  
    // Opportunity Cost
    const CFA_march2024_potentialInvestmentReturns = CFA_march2024_downPayment * (investmentReturnRate / 100);
    const CFA_march2024_netAfterOpportunityCost = CFA_march2024_totalEquityGained - CFA_march2024_potentialInvestmentReturns;
  
    // ========== MARCH 2025 PURCHASE SCENARIO ==========
  
    // Pre-Purchase Period
    const CFA_march2025_totalRentPaid = monthlyRent * 12;
    const CFA_march2025_downPayment = homePriceMarch2025 * (downPaymentPercentMarch2025 / 100);
    const CFA_march2025_investmentReturns = CFA_march2025_downPayment * (investmentReturnRate / 100);
    const CFA_march2025_netPrePurchasePosition = CFA_march2025_investmentReturns - CFA_march2025_totalRentPaid;
  
    // Purchase Costs
    const CFA_march2025_closingCosts = homePriceMarch2025 * (closingCostsPercent / 100);
    const CFA_march2025_totalPurchaseCosts = CFA_march2025_downPayment + CFA_march2025_closingCosts;
  
    // Total Position
    const CFA_march2025_totalCashSpent = CFA_march2025_totalRentPaid + CFA_march2025_totalPurchaseCosts;
    const CFA_march2025_netCashPosition = CFA_march2025_investmentReturns - CFA_march2025_totalRentPaid - CFA_march2025_closingCosts;
    const CFA_march2025_netCashPosition_no_rent = CFA_march2025_investmentReturns - CFA_march2025_closingCosts - ((0.25 * homePriceMarch2024) /100) *12;
  
    // Cash Efficiency Metrics
    const CFA_march2025_totalCashInvested = CFA_march2025_totalRentPaid + CFA_march2025_downPayment + CFA_march2025_closingCosts;
    const CFA_march2025_totalCashInvested_no_rent = CFA_march2025_downPayment + CFA_march2025_closingCosts + ((0.25 * homePriceMarch2024) /100) *12;
    const CFA_march2025_totalValueGained = CFA_march2025_downPayment + CFA_march2025_investmentReturns;
    const CFA_march2025_cashEfficiencyRatio = CFA_march2025_totalValueGained / CFA_march2025_totalCashInvested;
  
    // ========== COMPARISON ==========
    const CFA_difference = financialValues.paysRent ? CFA_march2025_netCashPosition - CFA_march2024_netCashPosition : CFA_march2025_netCashPosition_no_rent - CFA_march2024_netCashPosition;
    const CFA_recommendation = CFA_difference > 0 
      ? "Waiting to purchase until March 2025 is financially advantageous from a cash flow perspective."
      : "Purchasing in March 2024 is financially advantageous from a cash flow perspective.";
  
    // Update the cashFlowResults state
    setCashFlowResults({
      march2024: {
        initialInvestment: {
          downPayment: Math.round(CFA_march2024_downPayment),
          closingCosts: Math.round(CFA_march2024_closingCosts),
          totalInitialCashOutflow: Math.round(CFA_march2024_totalInitialCashOutflow)
        },
        monthlyOutflow: {
          mortgagePI: Math.round(CFA_march2024_monthlyMortgagePI),
          propertyTax: Math.round(CFA_march2024_monthlyPropertyTax),
          insurance: Math.round(CFA_march2024_monthlyInsurance),
          hoa: Math.round(monthlyHOA),
          maintenance: Math.round(CFA_march2024_monthlyMaintenance),
          totalMonthly: Math.round(CFA_march2024_monthlyTotalPayment),
          totalFor12Months: Math.round(CFA_march2024_totalPayments12Months)
        },
        assetValue: {
          initialValue: Math.round(CFA_march2024_initialHomeValue),
          valueAfter12Months: Math.round(CFA_march2024_homeValueAfter12Months),
          appreciation: Math.round(CFA_march2024_homeAppreciation),
          principalPaid: Math.round(CFA_march2024_principalPaid),
          totalEquityGained: Math.round(CFA_march2024_totalEquityGained)
        },
        cashEfficiency: {
          totalCashInvested: Math.round(CFA_march2024_totalCashInvested),
          totalValueGained: Math.round(CFA_march2024_totalValueGained),
          cashEfficiencyRatio: Math.round(CFA_march2024_cashEfficiencyRatio * 100) / 100,
          netCashPosition: Math.round(CFA_march2024_netCashPosition),
          
        },
        opportunityCost: {
          potentialInvestmentReturns: Math.round(CFA_march2024_potentialInvestmentReturns),
          netAfterOpportunityCost: Math.round(CFA_march2024_netAfterOpportunityCost)
        }
      },
      march2025: {
        prePurchasePeriod: {
          totalRentPaid: Math.round(CFA_march2025_totalRentPaid),
          investmentReturns: Math.round(CFA_march2025_investmentReturns),
          netPrePurchasePosition: Math.round(CFA_march2025_netPrePurchasePosition)
        },
        purchaseCosts: {
          downPayment: Math.round(CFA_march2025_downPayment),
          closingCosts: Math.round(CFA_march2025_closingCosts),
          totalPurchaseCosts: Math.round(CFA_march2025_totalPurchaseCosts)
        },
        totalPosition: {
          totalCashSpent: Math.round(CFA_march2025_totalCashSpent),
          investmentReturns: Math.round(CFA_march2025_investmentReturns),
          netCashPosition: Math.round(CFA_march2025_netCashPosition),
          netCashPositionNoRent : Math.round(CFA_march2025_netCashPosition_no_rent)
        },
        cashEfficiency: {
          totalCashInvested: Math.round(CFA_march2025_totalCashInvested),
          totalCashInvestedNoRent: Math.round(CFA_march2025_totalCashInvested_no_rent),
          totalValueGained: Math.round(CFA_march2025_totalValueGained),
          cashEfficiencyRatio: Math.round(CFA_march2025_cashEfficiencyRatio * 100) / 100
        }
      },
      comparison: {
        difference: Math.round(CFA_difference),
        recommendation: CFA_recommendation
      }
    });
  };
  
  // Helper function to calculate principal paid during the waiting period
  const calculatePrincipalPaid = (loanAmount, monthlyInterestRate, monthlyPayment, months) => {
    let balance = loanAmount;
    let totalPrincipal = 0;
    
    for (let i = 0; i < months; i++) {
      const interestPayment = balance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalPrincipal += principalPayment;
      balance -= principalPayment;
    }
    
    return totalPrincipal;
  };
  
  
  // Calculate results when inputs change
  useEffect(() => {
    calculateResults();
    calculateCashFlowResults();
  }, [
    homePriceMarch2024, downPaymentPercentMarch2024, mortgageRateMarch2024, mortgageTermMarch2024,
    homePriceAppreciationPercent, homePriceMarch2025, downPaymentPercentMarch2025, mortgageRateMarch2025, mortgageTermMarch2025,
    monthlyRent, investmentReturnRate, annualPropertyTaxRate, annualHomeInsurance, monthlyHOA, annualMaintenance, closingCostsPercent,financialValues.paysRent
  ]);
  console.log("values", cashFlowResults.march2025.totalPosition.netCashPositionNoRent)
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  useEffect(() => {
    // Set defaults based on property type
    if (propertyType === 'median-single-family') {
      setHomePriceMarch2024(650000);
      setMonthlyHOA(0);
      setHomePriceAppreciationPercent(6.2)
      if (autoCalculateRent) setMonthlyRent(3990);
    } else if (propertyType === 'median-condo') {
      setHomePriceMarch2024(450000);
      setMonthlyHOA(450);
      setHomePriceAppreciationPercent(1.4);
      if (autoCalculateRent) setMonthlyRent(2700);
    } else if (propertyType === 'starter') {
      setHomePriceMarch2024(450000);
      setMonthlyHOA(250);
      setHomePriceAppreciationPercent(2.8)
      if (autoCalculateRent) setMonthlyRent(1800);
    } else if (propertyType === 'mid-market') {
      setHomePriceMarch2024(640000);
      setMonthlyHOA(300);
      setHomePriceAppreciationPercent(1.6);
      if (autoCalculateRent) setMonthlyRent(3840);
    } else if (propertyType === 'luxury') {
      setHomePriceMarch2024(2200000);
      setMonthlyHOA(850);
      setHomePriceAppreciationPercent(12.5);
      if (autoCalculateRent) setMonthlyRent(13200);
    } else if (propertyType === 'ultra-luxury') {
      setHomePriceMarch2024(3984000);
      setMonthlyHOA(1200);
      setHomePriceAppreciationPercent(21.7)
      if (autoCalculateRent) setMonthlyRent(23904);
    } else if (propertyType === 'coral-gables') {
      setHomePriceMarch2024(1687500);
      setMonthlyHOA(600);
      setHomePriceAppreciationPercent(34.5)
      if (autoCalculateRent) setMonthlyRent(10125);
    }
  
    // Update home price March 2025 based on appreciation
    const newPrice = homePriceMarch2024 * (1 + homePriceAppreciationPercent / 100);
    setHomePriceMarch2025(Math.round(newPrice));
  
    // Auto-calculate other costs based on home price
    if (autoCalculateInsurance) {
      const insuranceRate = propertyType === 'median-condo' ? 0.7 : 0.85;
      setAnnualHomeInsurance(Math.round(homePriceMarch2024 * insuranceRate / 100));
    }
  
    if (autoCalculateMaintenance) {
      const maintenanceRate = propertyType === 'median-condo' ? 0.75 : 1.0;
      setAnnualMaintenance(Math.round(homePriceMarch2024 * maintenanceRate / 100));
    }
  }, [
    propertyType,
    homePriceAppreciationPercent,
    autoCalculateInsurance,
    autoCalculateMaintenance,
    autoCalculateRent
  ]);
  



  return (
    <div className="max-w-4xl mx-auto p-4">
        {/* Branding Header */}
    <div className="flex items-center justify-between bg-gray-100 rounded-xl shadow-sm p-4 mb-6">
    {/* Logo with background */}
    <div className="bg-white px-3 py-2 rounded-lg shadow border border-gray-200">
      <img src="logo.png" alt="Logo" className="h-14 w-auto" />
    </div>

    {/* Agent Mira photo with name */}
    <div className="flex items-center space-x-3">
      <img
        src="/agent-mira-pic.png"
        alt="Agent Mira"
        className="h-20 w-20 rounded-full object-cover border-2 border-blue-400 shadow-lg"
      />
      <div>
        <p className="text-sm text-gray-600">Your Trusted Advisor</p>
        <p className="font-semibold text-blue-700 text-lg">Agent Mira</p>
      </div>
    </div>
  </div>

    <h1 className="text-2xl font-bold mb-6 text-center">
      Home Purchase Timing Calculator: March 2024 vs. March 2025
    </h1>
      
      
      {/* Property Type Selection */}
      <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-4">Select Property Type & Financial Case</h2>

  <div className="flex flex-col md:flex-row gap-4">
    
    {/* Left Section: Property Type Buttons */}
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          title="All SFH across Miami"
          className={`p-2 rounded-md text-sm ${propertyType === 'median-single-family' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('median-single-family')}
        >
          Median Single Family
        </button>

        <button
          title="All Condos in Miami"
          className={`p-2 rounded-md text-sm ${propertyType === 'median-condo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('median-condo')}
        >
          Median Condos
        </button>

        <button
          title="SFH with up to 2 Beds and &lt;1250 sqft"
          className={`p-2 rounded-md text-sm ${propertyType === 'starter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('starter')}
        >
          Starter Homes
        </button>

        <button
          title="SFH with 3–4 Beds and 1250–2500 sqft"
          className={`p-2 rounded-md text-sm ${propertyType === 'mid-market' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('mid-market')}
        >
          Mid Market Homes
        </button>

        <button
          title="SFH with 4+ Beds and 3000+ sqft"
          className={`p-2 rounded-md text-sm ${propertyType === 'luxury' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('luxury')}
        >
          Luxury Homes
        </button>

        <button
          title="SFH with 5+ Beds, 4000+ sqft, and 4+ Baths"
          className={`p-2 rounded-md text-sm ${propertyType === 'ultra-luxury' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('ultra-luxury')}
        >
          Ultra Luxury Homes
        </button>

        <button
          title="SFHs in Coral Gables"
          className={`p-2 rounded-md text-sm ${propertyType === 'coral-gables' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPropertyType('coral-gables')}
        >
          Coral Gables Homes
        </button>
      </div>
    </div>

    {/* Right Section: Financial Case Dropdown */}
    <div className="flex-1">
      <label className="block text-sm font-semibold mb-2">Select Financial Case</label>
      <select
        className="w-full p-2 rounded-md border border-gray-300"
        value={financialCase}
        onChange={(e) => {
          const selected = e.target.value;
          setFinancialCase(selected);

          // Update financial values based on selected case
          switch (selected) {
            case '20-down-rent':
              setDownPaymentPercentMarch2024(20);
              setDownPaymentPercentMarch2025(20);
              setFinancialValues({
                paysRent: true,
              });
              break;
            case '20-down-norent':
              setDownPaymentPercentMarch2024(20);
              setDownPaymentPercentMarch2025(20);
              setFinancialValues({
                paysRent: false,
              });
              break;
            case '100-down-norent':
              setDownPaymentPercentMarch2024(100);
              setDownPaymentPercentMarch2025(100);
              setFinancialValues({
                paysRent: false,
              });
              break;
            case '100-down-rent':
              setDownPaymentPercentMarch2024(100);
              setDownPaymentPercentMarch2025(100);
              setFinancialValues({
                paysRent: true,
              });
              break;
            default:
              break;
          }
        }}
      >
        <option value="20-down-rent">20% Downpayment + Rent</option>
        <option value="20-down-norent">20% Downpayment + No Rent</option>
        <option value="100-down-norent">100% Downpayment + No Rent</option>
        <option value="100-down-rent">100% Downpayment + Rent</option>
      </select>
    </div>

  </div>
</div>



      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* March 2024 Scenario */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">March 2024 Scenario</h2>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Home Price in March 2024</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-r-md"
                value={homePriceMarch2024}
                onChange={(e) => setHomePriceMarch2024(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Down Payment %</label>
            <div className="flex">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-l-md"
                value={downPaymentPercentMarch2024}
                onChange={(e) => setDownPaymentPercentMarch2024(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Mortgage Rate %</label>
            <div className="flex">
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-l-md"
                value={mortgageRateMarch2024}
                onChange={(e) => setMortgageRateMarch2024(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Mortgage Term (Years)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={mortgageTermMarch2024}
              onChange={(e) => setMortgageTermMarch2024(Number(e.target.value))}
            />
          </div>
        </div>
        
        {/* March 2025 Scenario */}
        <div className="bg-green-50 p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-4">March 2025 Scenario</h2>
  
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">Home Price Appreciation %</label>
    <div className="flex">
      <input
        type="number"
        step="0.1"
        className="w-full p-2 border border-gray-300 rounded-l-md"
        value={homePriceAppreciationPercent}
        onChange={(e) => setHomePriceAppreciationPercent(Number(e.target.value))}
      />
      <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
    </div>
  </div>
  
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">Home Price in March 2025</label>
    <div className="flex">
      <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded-r-md"
        value={homePriceMarch2025}
        onChange={(e) => setHomePriceMarch2025(Number(e.target.value))}
      />
    </div>
  </div>
  
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">Down Payment %</label>
    <div className="flex">
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded-l-md"
        value={downPaymentPercentMarch2025}
        onChange={(e) => setDownPaymentPercentMarch2025(Number(e.target.value))}
      />
      <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
    </div>
  </div>
  
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">Mortgage Rate %</label>
    <div className="flex">
      <input
        type="number"
        step="0.1"
        className="w-full p-2 border border-gray-300 rounded-l-md"
        value={mortgageRateMarch2025}
        onChange={(e) => setMortgageRateMarch2025(Number(e.target.value))}
      />
      <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
    </div>
  </div>
  
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">Mortgage Term (Years)</label>
    <input
      type="number"
      className="w-full p-2 border border-gray-300 rounded-md"
      value={mortgageTermMarch2025}
      onChange={(e) => setMortgageTermMarch2025(Number(e.target.value))}
    />
  </div>
</div>
      </div>
      
      {/* Costs During Waiting Period */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-4">Costs During Waiting Period</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Monthly Rent</label>
      <div className="flex">
        <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-r-md"
          value={monthlyRent}
          onChange={(e) => {
            setMonthlyRent(Number(e.target.value));
            setAutoCalculateRent(false);
          }}
        />
      </div>
      <div className="flex items-center mt-1">
        <input
          type="checkbox"
          id="autoRent"
          checked={autoCalculateRent}
          onChange={(e) => setAutoCalculateRent(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="autoRent" className="text-xs text-gray-500">Auto-calculate based on property type</label>
      </div>
    </div>
    
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Investment Return Rate % (Annual)</label>
      <div className="flex">
        <input
          type="number"
          step="0.1"
          className="w-full p-2 border border-gray-300 rounded-l-md"
          value={investmentReturnRate}
          onChange={(e) => setInvestmentReturnRate(Number(e.target.value))}
        />
        <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">S&P 500 historical avg: ~10% | 2024-2025 performance: varies</p>
    </div>
  </div>
</div>
      
      {/* Additional Costs */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Additional Costs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Property Tax Rate % (Annual)</label>
            <div className="flex">
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-l-md"
                value={annualPropertyTaxRate}
                onChange={(e) => setAnnualPropertyTaxRate(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Miami-Dade typical: 0.97-1.05%</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Homeowners Insurance (Annual)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-r-md"
                value={annualHomeInsurance}
                onChange={(e) => {
                  setAnnualHomeInsurance(Number(e.target.value));
                  setAutoCalculateInsurance(false);
                }}
              />
            </div>
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="autoInsurance"
                checked={autoCalculateInsurance}
                onChange={(e) => setAutoCalculateInsurance(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoInsurance" className="text-xs text-gray-500">Auto-calculate (0.7-0.8% of home value)</label>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">HOA Fees (Monthly)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-r-md"
                value={monthlyHOA}
                onChange={(e) => setMonthlyHOA(Number(e.target.value))}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">$0 for most single-family, $300-700 for condos</p>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Maintenance Costs (Annual)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-r-md"
                value={annualMaintenance}
                onChange={(e) => {
                  setAnnualMaintenance(Number(e.target.value));
                  setAutoCalculateMaintenance(false);
                }}
              />
            </div>
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="autoMaintenance"
                checked={autoCalculateMaintenance}
                onChange={(e) => setAutoCalculateMaintenance(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoMaintenance" className="text-xs text-gray-500">Auto-calculate (1% of home value)</label>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Closing Costs %</label>
            <div className="flex">
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-l-md"
                value={closingCostsPercent}
                onChange={(e) => setClosingCostsPercent(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Typical range: 2-5%</p>
          </div>
        </div>
      </div>

         {/*cash flow UI*/}
                {/* Cash Flow Analysis */}
                <div className="mt-8">
                {/* Toggle Header */}
                <div 
                className="cursor-pointer text-2xl font-bold mb-4 text-center underline"
                onClick={() => setShowCashFlow(prev => !prev)}
                >
                {showCashFlow ? "Hide" : "Show"} Detailed Cash Flow Analysis
                </div>

                {/* toggle section */}
                {showCashFlow && (<div>
                    <h2 className="text-2xl font-bold mb-4 text-center">Detailed Cash Flow Analysis</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* March 2024 Cash Flow Analysis */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">March 2024 Purchase Cash Flow</h3>
                        
                      <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex justify-between">
                      <span>Purchase Cost</span>
                      <span>{formatCurrency(cashFlowResults.march2024.initialInvestment.totalInitialCashOutflow)}</span>
                    </h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Down Payment:</span>
                      <span>{formatCurrency(cashFlowResults.march2024.initialInvestment.downPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Closing Costs:</span>
                      <span>{formatCurrency(cashFlowResults.march2024.initialInvestment.closingCosts)}</span>
                    </div>
                  </div>
                        
                        <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Monthly Outflow</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.totalMonthly)}/mo</span>
  </h4>
  <div className="flex justify-between text-sm mb-1">
    <span>Mortgage (P&I):</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.mortgagePI)}/mo</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Property Tax:</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.propertyTax)}/mo</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Insurance:</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.insurance)}/mo</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>HOA:</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.hoa)}/mo</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Maintenance:</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.maintenance)}/mo</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Rent:</span>
    <span>{formatCurrency(0)}/mo</span>
  </div>
</div>

                        <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Annual Outflow</span>
    <span>{formatCurrency(cashFlowResults.march2024.monthlyOutflow.totalFor12Months)}</span>
  </h4>
</div>

                        
                       <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Return on Investment</span>
    <span>
      {formatCurrency(
        cashFlowResults.march2024.assetValue.principalPaid +
        cashFlowResults.march2024.assetValue.appreciation +
        0
      )}
    </span>
  </h4>
  <div className="flex justify-between text-sm mb-1">
    <span>Appreciation:</span>
    <span>{formatCurrency(cashFlowResults.march2024.assetValue.appreciation)}</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Principal Paid:</span>
    <span>{formatCurrency(cashFlowResults.march2024.assetValue.principalPaid)}</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Investment returns:</span>
    <span>{formatCurrency(0)}</span>
  </div>
</div>

                        
                        <div className="mb-4">
  <h4 className="font-semibold mb-2">
    Net Cash Position: {formatCurrency(cashFlowResults.march2024.cashEfficiency.netCashPosition)}
  </h4>
</div>

                        
                       
                        </div>
                        
                        {/* March 2025 Cash Flow Analysis */}
                        <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">March 2025 Purchase Cash Flow</h3>
                      
                        
                                        <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex justify-between">
                      <span>Purchase Costs</span>
                      <span>{formatCurrency(cashFlowResults.march2025.purchaseCosts.totalPurchaseCosts)}</span>
                    </h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Down Payment:</span>
                      <span>{formatCurrency(cashFlowResults.march2025.purchaseCosts.downPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Closing Costs:</span>
                      <span>{formatCurrency(cashFlowResults.march2025.purchaseCosts.closingCosts)}</span>
                    </div>
                  </div>


                       <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Monthly Outflow</span>
    <span>
      {financialValues.paysRent
        ? `${formatCurrency(cashFlowResults.march2025.prePurchasePeriod.totalRentPaid / 12)}/mo`
        : `${formatCurrency(((0.25 * homePriceMarch2024)/100))}/mo`}
    </span>
  </h4>

  <div className="flex justify-between text-sm mb-1">
    <span>Mortgage (P&I):</span>
    <span>—</span>
  </div>

  <div className="flex justify-between text-sm mb-1">
    <span>Property Tax:</span>
    <span>—</span>
  </div>

  <div className="flex justify-between text-sm mb-1">
    <span>Insurance:</span>
    <span>—</span>
  </div>

  <div className="flex justify-between text-sm mb-1">
    <span>HOA:</span>
    <span>—</span>
  </div>

  {financialValues.paysRent ? (
    <>
      <div className="flex justify-between text-sm mb-1">
        <span>Maintenance:</span>
        <span>—</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Rent:</span>
        <span>{formatCurrency(cashFlowResults.march2025.prePurchasePeriod.totalRentPaid / 12)}/mo</span>
      </div>
    </>
  ) : (
    <>
      <div className="flex justify-between text-sm mb-1">
        <span>Maintenance:</span>
        <span>{formatCurrency(((0.25 * homePriceMarch2024)/100))}/mo</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Rent:</span>
        <span>—</span>
      </div>
    </>
  )}
</div>



                         <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Annual Outflow</span>
    <span>{formatCurrency(cashFlowResults.march2025.prePurchasePeriod.totalRentPaid)}</span>
  </h4>
</div>

                       <div className="mb-4">
  <h4 className="font-semibold mb-2 flex justify-between">
    <span>Return on Investment</span>
    <span>{formatCurrency(cashFlowResults.march2025.prePurchasePeriod.investmentReturns)}</span>
  </h4>
  <div className="flex justify-between text-sm mb-1">
    <span>Appreciation:</span>
    <span>{formatCurrency(0)}</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Principal Paid:</span>
    <span>{formatCurrency(0)}</span>
  </div>
  <div className="flex justify-between text-sm mb-1">
    <span>Investment returns:</span>
    <span>{formatCurrency(cashFlowResults.march2025.prePurchasePeriod.investmentReturns)}</span>
  </div>
</div>

                        
                        {/* <div className="mb-4">
                            <h4 className="font-semibold mb-2">Total Position</h4>
                            <div className="flex justify-between text-sm mb-1">
                            <span>Total Cash Spent:</span>
                            <span>{formatCurrency(cashFlowResults.march2025.totalPosition.totalCashSpent)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                            <span>Investment Returns:</span>
                            <span>{formatCurrency(cashFlowResults.march2025.totalPosition.investmentReturns)}</span>
                            </div>
                    
                        </div> */}
                        
                        <div className="mb-4">
  <h4 className="font-semibold mb-2">
    Net Cash Position: {formatCurrency(
      financialValues.paysRent
        ? cashFlowResults.march2025.totalPosition.netCashPosition
        : cashFlowResults.march2025.totalPosition.netCashPositionNoRent
    )}
  </h4>
</div>



                        </div>
                    </div>
                    
                    {/* Final Cash Flow Comparison */}
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Waiting Benefit</h3>
                        <p className="text-2xl font-bold mb-2">
                            {cashFlowResults.comparison.difference > 0 ? "+" : ""}{formatCurrency(cashFlowResults.comparison.difference)}
                        </p>
                        <p className={`text-lg font-medium ${cashFlowResults.comparison.difference > 0 ? "text-green-600" : "text-red-600"}`}>
                            {cashFlowResults.comparison.recommendation}
                        </p>
                        </div>
                    </div>

                    </div>)}
                    
            </div>
      
      {/* Results */}
      
 
    </div>
  );
};

export default HomePurchase1;
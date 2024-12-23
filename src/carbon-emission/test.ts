// Define types for better clarity
type EnergyData = {
  energyGenerated: number[]; // Sản lượng điện của các nhà máy (MWh)
  emissionFactors: number[]; // Hệ số phát thải CO2 của các nhà máy (tCO2/MWh)
};

type Weights = {
  OM: number; // Trọng số của Operating Margin
  BM: number; // Trọng số của Build Margin
};

// Helper function to calculate emission factor
function calculateEmissionFactor(data: EnergyData): number {
  const { energyGenerated, emissionFactors } = data;

  if (energyGenerated.length !== emissionFactors.length) {
    throw new Error(
      'Energy generated and emission factors arrays must have the same length',
    );
  }

  let totalEnergy = 0;
  let totalEmissions = 0;

  energyGenerated.forEach((eg, index) => {
    totalEnergy += eg; // Tổng sản lượng điện
    totalEmissions += eg * emissionFactors[index]; // Tổng phát thải
  });

  return totalEnergy > 0 ? totalEmissions / totalEnergy : 0; // Hệ số phát thải
}

// Step 1: Calculate Operating Margin (OM)
function calculateOM(data: EnergyData, method: 'simple' = 'simple'): number {
  if (method === 'simple') {
    return calculateEmissionFactor(data);
  }
  throw new Error('Other methods not implemented yet');
}

// Step 2: Calculate Build Margin (BM)
function calculateBM(data: EnergyData): number {
  return calculateEmissionFactor(data);
}

// Step 3: Calculate Combined Margin (CM)
function calculateCM(
  OM: number,
  BM: number,
  weights: Weights = { OM: 0.5, BM: 0.5 },
): number {
  return weights.OM * OM + weights.BM * BM;
}

// Example usage
(function runCalculation() {
  // Input data for Operating Margin
  const OMData: EnergyData = {
    energyGenerated: [100, 200, 300], // Sản lượng điện (MWh)
    emissionFactors: [0.5, 0.6, 0.7], // Hệ số phát thải (tCO2/MWh)
  };

  // Input data for Build Margin
  const BMData: EnergyData = {
    energyGenerated: [150, 250], // Sản lượng điện (MWh)
    emissionFactors: [0.4, 0.45], // Hệ số phát thải (tCO2/MWh)
  };

  // Calculation
  const OM = calculateOM(OMData);
  const BM = calculateBM(BMData);
  const CM = calculateCM(OM, BM);

  // Output results
  console.log('Operating Margin (OM):', OM.toFixed(4), 'tCO2/MWh');
  console.log('Build Margin (BM):', BM.toFixed(4), 'tCO2/MWh');
  console.log('Combined Margin (CM):', CM.toFixed(4), 'tCO2/MWh');
})();

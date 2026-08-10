export const deals = {
  allReservable: {
    dealName: 'Huawei Pura X 80',
    items: [{ itemName: 'Black - Bose QC45', quantity: 1 }],
  },
  partiallyReservable: {
    dealName: 'Huawei Pura X 80',
    items: [
      { itemName: 'White - MX542AM/A', quantity: 1 },
      { itemName: 'Black - Bose QC45', quantity: 1 },
    ],
  },
  noneReservable: {
    dealName: 'Huawei Pura X 80',
    items: [{ itemName: 'White - MX542AM/A', quantity: 1 }],
  },
  unavailable: {
    dealName: 'Nonexistent Deal XYZ',
    items: [{ itemName: 'Whatever', quantity: 1 }],
  },
  mismatchedItem: {
    dealName: 'Huawei Pura X 80',
    items: [{ itemName: 'Green - Nonexistent Model', quantity: 1 }],
  },
};

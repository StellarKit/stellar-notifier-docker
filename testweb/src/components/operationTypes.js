const names = {
  0: 'Create Account',
  1: 'Payment',
  2: 'Path Payment',
  3: 'Manage Offer',
  4: 'Create Passive Offer',
  5: 'Set Options',
  6: 'Change Trust',
  7: 'Allow Trust',
  8: 'Account Merge',
  9: 'Inflation',
  10: 'Manage Data',
  11: 'Bump Sequence'
}

export default class OperationTypes {
  static nameForType(type) {
    return names[type]
  }
}
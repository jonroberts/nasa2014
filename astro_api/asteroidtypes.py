SPECTRAL_INDEX_TYPE = {
    '?': 'None',
    'A': 'None',
    'B': 'Hydrogen',
    'C': 'Hydrogen',
    'Ch': 'Hydrogen',
    'Cg': 'Hydrogen',
    'Cgh': 'Hydrogen',
    'C type': 'Hydrogen',
    'Cb': 'Hydrogen',
    'D': 'Water',
    'E': 'None',
    'K': 'Hydrogen',
    'L': 'Metals',
    'Ld': 'None',
    'M': 'Metals',
    'O': 'Platinum',
    'P': 'Water',
    'R': 'None',
    'S': 'None',
    'Sa': 'None',
    'Sq': 'None',
    'Sr': 'None',
    'Sk': 'None',
    'Sl': 'None',
    'S(IV)': 'None',
    'Q': 'Metals',
    'T': 'Metals',
    'U': 'None',
    'V': 'None',
    'X': 'Metals',
    'Xe': 'Metals',
    'Xc': 'Metals',
    'Xk': 'Metals',
    'comet': 'None'
}

def GetType(spec):
    if not spec in SPECTRAL_INDEX_TYPE:
        return 'None'
    return SPECTRAL_INDEX_TYPE[spec]
    
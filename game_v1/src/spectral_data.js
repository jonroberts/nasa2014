var SPECTRAL_INDEX = {
    '?': {},
    'A': {},
    'B': {
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
        'iron': 10,
    },
    'C': {
//    # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .2,
        'iron': .166,
        'nickel': .014,
        'cobalt': .002,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,

        //   # Original estimates:

//    #'water': 1.55495461,
        // #'platinum': 0.01,

        //   # lewis estimates
        //   #'iron': 62.196,
        //   #'nickel': 1.26,
        //  #'cobalt': 0.18,
    },
    'Ch': {
        //   # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .2,
        'iron': .166,
        'nickel': .014,
        'cobalt': .002,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'Cg': {
        //   # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .2,
        'iron': .166,
        'nickel': .014,
        'cobalt': .002,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'Cgh': {
        //  # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .2,
        'iron': .166,
        'nickel': .014,
        'cobalt': .002,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'C type': {
        // # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .2,
        'iron': .166,
        'nickel': .014,
        'cobalt': .002,

        //  # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'Cb': { //  # transition object between C and B
        //  #'hydrogen': 0.1175,
        //  #'iron': 12.5,
        //  #'water': 0.775,
        //  #'nickel-iron': 0.0434,
        //   #'platinum': 0.005,
//
//    # lewis estimates
        //  #'iron': 36,
        //  #'nickel': 0.63,
        //  #'cobalt': 0.09,

        //   # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .1,
        'iron': .083,
        'nickel': .007,
        'cobalt': .001,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'D': {
        'water': 0.000023,
    },
    'E': {

    },
    'K': { // # cross between S and C
//    #'water': 0.775,
//    #'nickel-iron': 0.0434,
//    #'platinum': 0.005,

//    # lewis estimates
//    #'iron': 31.098,
//    #'nickel': 0.13,
//    #'cobalt': 0.09,

//    # from Keck report at http://www.kiss.caltech.edu/study/asteroid/asteroid_final_report.pdf
        'water': .1,
        'iron': .083,
        'nickel': .007,
        'cobalt': .001,

//    # volatiles
        'hydrogen': 0.235,
        'nitrogen': 0.001,
        'ammonia': 0.001,
    },
    'L': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
        'aluminum': 7
    },
    'Ld': { // # copied from S
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'M': {
        'iron': 88,
        'nickel': 10,
        'cobalt': 0.5,
    },
    'O': {
        'nickel-iron': 2.965,
        'platinum': 1.25,
    },
    'P': { // # correspond to CI, CM carbonaceous chondrites
        'water': 12.5,
    },
    'R': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'S': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    //# Sa, Sq, Sr, Sk, and Sl all transition objects (assume half/half)
    'Sa': {
        'magnesium silicate': 5e-31,
        'iron silicate': 0,
    },
    'Sq': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'Sr': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'Sk': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'Sl': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'S(IV)': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },
    'Q': {
        'nickel-iron': 13.315,
    },
    'T': {
        'iron': 6,
    },
    'U': {

    },
    'V': {
        'magnesium silicate': 1e-30,
        'iron silicate': 0,
    },

    //# TODO use density to decide on what kind of X?
    'X': { // # TODO these vals only apply to M-type within X
        'iron': 88,
        'nickel': 10,
        'cobalt': 0.5,
    },
    'Xe': {  ////# TODO these vals only apply to M-type within X
        'iron': 88,
        'nickel': 10,
        'cobalt': 0.5,
    },
    'Xc': {
        'iron': 88,
        'nickel': 10,
        'cobalt': 0.5,
        'platinum': 0.005,
    },
    'Xk': {
        'iron': 88,
        'nickel': 10,
        'cobalt': 0.5,
    },
    'comet': {
    },
};
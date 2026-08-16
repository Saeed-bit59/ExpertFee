import {
  normalizePersianText,
  searchExpertServices,
  isAmbiguousSearchResult
} from "../src/engine/ExpertSearchEngine";


function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {
    throw new Error(
      `TEST FAILED: ${message}`
    );
  }

}


function printResults(
  query: string
): void {

  const results =
    searchExpertServices(
      query
    );


  console.log(
    `\nSearch: "${query}"`
  );


  for (
    const result
    of results
  ) {

    console.log(
      [
        result.type,
        result.title,
        `score=${result.score}`,
        result.article
          ? `article=${result.article}`
          : ""
      ]
        .filter(Boolean)
        .join(" | ")
    );

  }

}


/*
 * ========================================
 * Test 1
 * Persian normalization
 * ========================================
 */

assert(
  normalizePersianText(
    "ماشين آلات"
  ) ===
    "ماشین آلات",

  "Arabic Yeh must convert to Persian Yeh."
);


assert(
  normalizePersianText(
    "تأسيسات كارخانجات"
  ).includes(
    "کارخانجات"
  ),

  "Arabic Kaf must convert to Persian Kaf."
);


assert(
  normalizePersianText(
    "ماشین‌آلات"
  ) ===
    "ماشین آلات",

  "Half-space must normalize to normal space."
);


/*
 * ========================================
 * Test 2
 * Valuation
 * ========================================
 */

const valuationResults =
  searchExpertServices(
    "ارزیابی"
  );


assert(
  valuationResults.some(
    (result) =>
      result.type ===
        "SERVICE" &&
      result.service?.id ===
        "VALUATION"
  ),

  "Valuation must find Article 11 service."
);


/*
 * ========================================
 * Test 3
 * Rent
 * ========================================
 */

const rentResults =
  searchExpertServices(
    "اجاره"
  );


assert(
  rentResults.some(
    (result) =>
      result.service?.id ===
      "RENT"
  ),

  "Rent must find Article 13."
);


/*
 * ========================================
 * Test 4
 * Crane
 * ========================================
 */

const craneResults =
  searchExpertServices(
    "جرثقیل"
  );


const craneSubject =
  craneResults.find(
    (result) =>
      result.type ===
        "SUBJECT" &&
      result.subject?.id ===
        "CRANE"
  );


assert(
  craneSubject !==
    undefined,

  "Crane must be recognized as a subject."
);


assert(
  craneSubject
    ?.relatedFields
    .some(
      (field) =>
        field.id ===
        "FACTORY_MACHINERY"
    ) === true,

  "Crane must be related to factory machinery field."
);


assert(
  craneSubject
    ?.relatedFields
    .some(
      (field) =>
        field.id ===
        "WORK_ACCIDENT"
    ) === true,

  "Crane must also be related to work accidents."
);


assert(
  craneSubject !==
    undefined &&
  isAmbiguousSearchResult(
    craneSubject
  ),

  "Crane must be treated as an ambiguous subject."
);


/*
 * ========================================
 * Test 5
 * Crane alias
 * ========================================
 */

const craneAliasResults =
  searchExpertServices(
    "کرین"
  );


assert(
  craneAliasResults.some(
    (result) =>
      result.subject?.id ===
      "CRANE"
  ),

  "Crane alias must find CRANE subject."
);


/*
 * ========================================
 * Test 6
 * Industrial machinery
 * ========================================
 */

const machineryResults =
  searchExpertServices(
    "ماشین آلات"
  );


assert(
  machineryResults.some(
    (result) =>
      result.subject?.id ===
      "INDUSTRIAL_MACHINERY"
  ),

  "Industrial machinery subject must be found."
);


assert(
  machineryResults.some(
    (result) =>
      result.field?.id ===
      "FACTORY_MACHINERY"
  ),

  "Factory machinery field must be found."
);


/*
 * ========================================
 * Test 7
 * Well
 * ========================================
 */

const wellResults =
  searchExpertServices(
    "چاه"
  );


assert(
  wellResults.some(
    (result) =>
      result.subject?.id ===
      "WELL"
  ),

  "Well subject must be found."
);


assert(
  wellResults.some(
    (result) =>
      result.field?.id ===
      "WATER"
  ),

  "Water field must be found for well search."
);


/*
 * ========================================
 * Test 8
 * Accounting / auditing
 * ========================================
 */

const auditingResults =
  searchExpertServices(
    "حسابرسی"
  );


assert(
  auditingResults.some(
    (result) =>
      result.field?.id ===
      "ACCOUNTING"
  ),

  "Auditing must find accounting and auditing field."
);


/*
 * ========================================
 * Test 9
 * Vehicle
 * ========================================
 */

const vehicleResults =
  searchExpertServices(
    "خودرو"
  );


assert(
  vehicleResults.some(
    (result) =>
      result.subject?.id ===
      "VEHICLE"
  ),

  "Vehicle subject must be found."
);


assert(
  vehicleResults.some(
    (result) =>
      result.field?.id ===
      "MOTOR_VEHICLES"
  ),

  "Vehicle field must be found."
);


/*
 * ========================================
 * Test 10
 * Unknown search
 * ========================================
 */

const unknownResults =
  searchExpertServices(
    "زززززززز"
  );


assert(
  unknownResults.length === 0,

  "Unknown expression must return no results."
);


/*
 * ========================================
 * Test 11
 * Minimum two characters
 * ========================================
 */

assert(
  searchExpertServices(
    "م"
  ).length === 0,

  "One-character query must not search."
);


/*
 * ========================================
 * Diagnostic output
 * ========================================
 */

printResults(
  "جرثقیل"
);

printResults(
  "کرین"
);

printResults(
  "ماشین آلات"
);

printResults(
  "چاه"
);

printResults(
  "حسابرسی"
);

printResults(
  "ارزیابی"
);

printResults(
  "اجاره"
);

printResults(
  "خودرو"
);


console.log(
  "\n========================================"
);

console.log(
  "Expert Search Engine: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
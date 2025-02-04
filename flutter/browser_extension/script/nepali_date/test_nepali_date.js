function it(description, test_function, index_to_test) {

    const result = document.createElement('p');
    try {
      test_function(index_to_test)
      result.setAttribute("class",'success');
      result.innerHTML = description;
    } catch (error) {
      result.setAttribute("class",'failure');
      result.innerHTML = `${description}<br/><pre>${error}</pre>`;
    }
  
    document.querySelector("html").appendChild(result);
  }

ENGLISH_DATES_ARRAY = [
    new Date(2023, 10, 27),
    new Date(1943,3,14),
    new Date(1943,3,15),
    new Date(1944,3,13),
    new Date(1944,5,14),
    new Date(2003,3,10),
    new Date(2023,5,14),
    new Date(2028,3,14),
    new Date(2011,6,17),
  ]

// YYYY - MM - DD
// MM starts from 0
NEPALI_DATES_ARRAY = [
    [2080, 7, 11],
    [2000, 0, 1],
    [2000, 0, 2],
    [2001, 0, 1],
    [2001, 2, 1],
    [2059, 11, 27],
    [2080, 1, 31],
    [2085, 0, 2],
    [2068, 3, 1],
]

  
function test_function(index){
    // test from english date array to nepali date and see if that macthes the result we have
    our_date_object = new NepaliDate(false, ENGLISH_DATES_ARRAY[index]);
    nep_date_values = NEPALI_DATES_ARRAY[index];
    console.log(nep_date_values);
    console.log(our_date_object);
    if (
          our_date_object.getYear() == nep_date_values[0] &&
          our_date_object.getMonth() == nep_date_values[1] &&
          our_date_object.getDate() == nep_date_values[2])
        {
        return;

   } else {
        throw new Error(`${nep_date_values} != ${our_date_object.getYear()},${our_date_object.getMonth()},${our_date_object.getDate()}`);
      }
}

    
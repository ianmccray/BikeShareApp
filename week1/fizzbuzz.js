// use this template for your fizzbuzz code

function fizzbuzz(numbers) {
  
  const result = numbers.map(value =>{ 
    str = "";
    if(value%3 === 0)
        str = "fizz";
    if(value%5 === 0)
        str = str + "buzz";
    if(str === "")
        return value;
    else 
        return str;
   });
    
    return result;
    
}


// here's a test case to see if you got it right
// DON'T CHANGE THIS
function test() {
  let arr = [];
  for (let i = 1; i < 101; i++) {
    arr.push(i);
  }
  let updatedArray = fizzbuzz(arr);
  updatedArray.forEach(element => {
    console.log(element);
  });
}

test();

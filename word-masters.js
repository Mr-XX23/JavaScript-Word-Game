
const letters = document.querySelectorAll('.scoreboard-letter');
const LoadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
    let currentGuss = '';
    let currentRow = 0;
    let done = false;
    let isLoading = true;


    // fetch word of the day
    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordPart = word.split('');
    // console.log(word);
    // console.log(wordPart);
    setloading(false);
    isLoading = false;
    
    // handle input letter and print it on screen
    function addletter(letter) {
        
        if ( currentGuss.length < ANSWER_LENGTH) {
            // add letter to the end of currentGuss
            currentGuss += letter;
        } else {
            // replace last letter of currentGuss with new letter
            currentGuss = currentGuss.substring(0, currentGuss.length - 1) + letter;
        }
        // print letter on screen
        letters[(ANSWER_LENGTH * currentRow )+ currentGuss.length - 1].innerText = letter;
    }
    


    // handle typing input event
    document.addEventListener('keydown', function handleKeyPress (event) {
        
        if ( done || isLoading ) {
            // do nothing
            return;
        }
        
        const action = event.key;
        // console.log(action);

        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        }  else if (isLetter(action)) {
           addletter(action.toUpperCase());
        }
         else {
            // do nothing
            // handle other input
        }
        
    })

    // function to handle commit button
    async function commit() { 

    // Validate the word
    isLoading = true;
    setloading(true);
    const res = await fetch(`https://words.dev-apis.com/validate-word`, { 
        method: 'POST', 
        body: JSON.stringify({ word: currentGuss }) 
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setloading(false);

    if (!validWord) {
        markInvalidWord( currentRow );
        return;
    } 

    // do all the marking as " correct" or "close" or "wrong"
    // guest is a array of letter. 
    const guestPart = currentGuss.split('');
    const map = makeMap(wordPart);
    // console.log(map);

    for ( let i = 0; i < ANSWER_LENGTH; i++) {
        // mark as correct
        if (guestPart[i] === wordPart[i]) {
            letters[(ANSWER_LENGTH * currentRow )+ i].classList.add('correct');
            map[guestPart[i]]--;
        }
    }

    for ( let i = 0; i < ANSWER_LENGTH; i++) {
        if (guestPart[i] === wordPart[i]) {
            
        } else if (wordPart.includes(guestPart[i]) && map[guestPart[i]] > 0) {
            // make as close
            letters[(ANSWER_LENGTH * currentRow )+ i].classList.add('close');
        } else {
            letters[(ANSWER_LENGTH * currentRow )+ i].classList.add('wrong');
        }
    }
    
    currentRow++;
    if ( currentGuss === word) {
        // win  
        alert('Congratulation! You win!. Yoe gussed the word correctly');
        document.querySelector('.brand').classList.add('winner');
        done = true;
        return;
    } else if (currentRow === ROUNDS) {
        alert('Sorry! You lose. You have used all your guesses');
        done = true;
    } 
    currentGuss = '';
    }

    function markInvalidWord() {
        alert('Invalid word');
        // this function will mark the word as invalid
        for ( let i = 0; i < ANSWER_LENGTH; i++) {
            letters[(ANSWER_LENGTH * currentRow )+ i].classList.remove('invalid');
        }
        // this will make the word invalid after user type  second or thirld invalid type
        setTimeout( function () {
            letters[(ANSWER_LENGTH * currentRow )+ i].classList.add('invalid');
        }, 10);
    
    }

    // function to handle backspace 
    function backspace() {
        currentGuss = currentGuss.substring(0, currentGuss.length - 1);
        letters[(ANSWER_LENGTH * currentRow )+ currentGuss.length].innerText = '';
    }


    // function to loading
    function setloading(isLoading) {
        LoadingDiv.classList.toggle('show', isLoading);
    }

    // handle to check letter is valid or not
    function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
    }

}


// function to make map
 function makeMap ( array ) {
    const obj = {};
    for ( let i = 0; i < array.length; i++) {
        const letter = array[i];
       if (obj[letter]) {
           obj[letter]++;
       } else {
            obj[letter] = 1;
       }

    }
    return obj;
 } 



init();
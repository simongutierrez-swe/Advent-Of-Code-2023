/* eslint-disable complexity */
/*
--- Day 1: Trebuchet?! ---
Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

For example:

1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

Consider your entire calibration document. What is the sum of all of the calibration values?
*/

const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString();
const test = 'two1nine eightwothree abcone2threexyz xtwone3four 4nineeightseven2 zoneight234 7pqrstsixteen';

const numsBank = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
};

const findWrittenNum = (strLen3, strLen4, strLen5) => {
    if (numsBank[strLen3]) {
        return numsBank[strLen3];
    } else if (numsBank[strLen4]) {
        return numsBank[strLen4]
    } else if (numsBank[strLen5]) {
        return numsBank[strLen5]
    }
}

const findCalibrationVals = (str) => {
    let result = str.split(' ');
    let total = 0;

    result.forEach( e => {
        let start = 0, end = e.length - 1, first = '', second = '';

        while (start < end && !first || !second) {
            if (!first) {
                const word1 = e[start] + e[start + 1] + e[start + 2];
                const word2 = word1 + e[start + 3];
                const word3 = word2 + e[start + 4];
                let isWrittenNum = findWrittenNum(word1, word2, word3);

                if (Number(e[start])) {
                    first = e[start];
                } else if (isWrittenNum) {
                    first = isWrittenNum;
                } else {
                    start++;
                }
            }

            if (!second) {
                const word1 = e[end - 2] + e[end - 1] + e[end];
                const word2 = e[end - 3] + word1;
                const word3 = e[end - 4] + word2;
                let isWrittenNum = findWrittenNum(word1, word2, word3);
                // console.log(word1, word2, word3);

                if (Number(e[end])) {
                    second = e[end];
                } else if (isWrittenNum) {
                    second = isWrittenNum;
                } else {
                    end--;
                }
            }
        }

        if (first && !second) {
            total += Number(first + first);
        } else if (!first && second) {
            total += Number(second + second);
        } else {
            total += Number(first + second);
        }
    });

    return total;
};

console.log(findCalibrationVals(input)); // 54667

/*
--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen

In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.
*/


const isNum = (str) => {

}

const findCalibrationVals2 = (str) => {

}

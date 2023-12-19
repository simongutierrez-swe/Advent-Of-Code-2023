/* eslint-disable no-loop-func */
/* eslint-disable complexity */
/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?
*/

const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.resolve('../Inputs/', 'input3.txt'), 'utf8').split('\n');
const test = '467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..'.split('\n');

const findValidSchematicPartNumbers = (schematic) => {
    let total = 0;

    for (let row = 0; row < schematic.length; row++) {
        const currRow = schematic[row].replace(/\./g, ' ');

        for (const match of currRow.matchAll(/\d+/g)) {
            for (let j = match.index; j < match.index + match[0].length; j++) {
                const surrounding = [
                    (input[row - 1] ?? '')[j - 1] ?? '.',
                    (input[row - 1] ?? '')[j] ?? '.',
                    (input[row - 1] ?? '')[j + 1] ?? '.',
                    (input[row] ?? '')[j - 1] ?? '.',
                    (input[row] ?? '')[j] ?? '.',
                    (input[row] ?? '')[j + 1] ?? '.',
                    (input[row + 1] ?? '')[j - 1] ?? '.',
                    (input[row + 1] ?? '')[j] ?? '.',
                    (input[row + 1] ?? '')[j + 1] ?? '.'
                ];
                if (surrounding.some(x => /[^0-9.]/.test(x))) {
                    total += Number(match[0]);
                    break;
                }
            }
        }

    }

    return total;
}

// console.log(findValidSchematicPartNumbers(input)); // 538046


/*
--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/

const findNum = (schem, row, col) => {
    let currCol = col;
    let result = schem[row][currCol];

    while (/[0-9]/.test(schem[row][currCol + 1] ?? '')) {
        result = result + schem[row][currCol + 1];
        currCol++;
    }

    currCol = col; // reset

    while (/[0-9]/.test(schem[row][currCol - 1] ?? '')) {
        result = schem[row][currCol - 1] + result;
        currCol--;
    }

    return result;
}

// console.log(findNum(test, 9, 5));

const findValidSchematicPartNumbers2 = (schematic) => {
    let total = 0;

    for (let row = 0; row < schematic.length; row++) {
        const currRow = schematic[row].replace(/\./g, ' ');
        for (const match of currRow.matchAll(/\*/g)) {
            let j = match.index;
            let temp = 1, count = 0;
            const surrounding = [
                (schematic[row - 1] ?? '')[j - 1] ?? '.',
                (schematic[row - 1] ?? '')[j] ?? '.',
                (schematic[row - 1] ?? '')[j + 1] ?? '.',
                (schematic[row] ?? '')[j - 1] ?? '.',
                (schematic[row] ?? '')[j] ?? '.',
                (schematic[row] ?? '')[j + 1] ?? '.',
                (schematic[row + 1] ?? '')[j - 1] ?? '.',
                (schematic[row + 1] ?? '')[j] ?? '.',
                (schematic[row + 1] ?? '')[j + 1] ?? '.'
            ];

            const surroundingPoints = [
                [row - 1, j - 1],
                [row - 1, j],
                [row - 1, j + 1],
                [row, j - 1],
                [row, j],
                [row, j + 1],
                [row + 1, j - 1],
                [row + 1, j],
                [row + 1, j + 1],

            ]

            surrounding.forEach((x, idx) => {
                // console.log(x, /[0-9]/.test(x), idx);
                if (/[0-9]/.test(x)) {
                    const [surrRow, surrCol] = surroundingPoints[idx];
                    // find a way to not recount a number
                    console.log(findNum(schematic, surrRow, surrCol));
                    temp *= Number(findNum(schematic, surrRow, surrCol));
                    count++;
                }
            });

            total += count >= 2 ? temp : 0;

        }
    }

    return total;
}

console.log(findValidSchematicPartNumbers2(test)); //

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
const test = '467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..';

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
                    total += parseInt(match[0]);
                    break;
                }
            }
        }

    }

    return total;
}

console.log(findValidSchematicPartNumbers(input)); // 538046

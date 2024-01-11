/*
--- Day 5: If You Give A Seed A Fertilizer ---
You take the boat and find the gardener right where you were told he would be: managing a giant "garden" that looks more to you like a farm.

"A water source? Island Island is the water source!" You point out that Snow Island isn't receiving any water.

"Oh, we had to stop the water because we ran out of sand to filter it with! Can't make snow with dirty water. Don't worry, I'm sure we'll get more sand soon; we only turned off the water a few days... weeks... oh no." His face sinks into a look of horrified realization.

"I've been so busy making sure everyone here has food that I completely forgot to check why we stopped getting more sand! There's a ferry leaving soon that is headed over in that direction - it's much faster than your boat. Could you please go check it out?"

You barely have time to agree to this request when he brings up another. "While you wait for the ferry, maybe you can help us with our food production problem. The latest Island Island Almanac just arrived and we're having trouble making sense of it."

The almanac (your puzzle input) lists all of the seeds that need to be planted. It also lists what type of soil to use with each kind of seed, what type of fertilizer to use with each kind of soil, what type of water to use with each kind of fertilizer, and so on. Every type of seed, soil, fertilizer and so on is identified with a number, but numbers are reused by each category - that is, soil 123 and fertilizer 123 aren't necessarily related to each other.

For example:

seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
The almanac starts by listing which seeds need to be planted: seeds 79, 14, 55, and 13.

The rest of the almanac contains a list of maps which describe how to convert numbers from a source category into numbers in a destination category. That is, the section that starts with seed-to-soil map: describes how to convert a seed number (the source) to a soil number (the destination). This lets the gardener and his team know which soil to use with which seeds, which water to use with which fertilizer, and so on.

Rather than list every source number and its corresponding destination number one by one, the maps describe entire ranges of numbers that can be converted. Each line within a map contains three numbers: the destination range start, the source range start, and the range length.

Consider again the example seed-to-soil map:

50 98 2
52 50 48
The first line has a destination range start of 50, a source range start of 98, and a range length of 2. This line means that the source range starts at 98 and contains two values: 98 and 99. The destination range is the same length, but it starts at 50, so its two values are 50 and 51. With this information, you know that seed number 98 corresponds to soil number 50 and that seed number 99 corresponds to soil number 51.

The second line means that the source range starts at 50 and contains 48 values: 50, 51, ..., 96, 97. This corresponds to a destination range starting at 52 and also containing 48 values: 52, 53, ..., 98, 99. So, seed number 53 corresponds to soil number 55.

Any source numbers that aren't mapped correspond to the same destination number. So, seed number 10 corresponds to soil number 10.

So, the entire list of seed numbers and their corresponding soil numbers looks like this:

seed  soil
0     0
1     1
...   ...
48    48
49    49
50    52
51    53
...   ...
96    98
97    99
98    50
99    51
With this map, you can look up the soil number required for each initial seed number:

Seed number 79 corresponds to soil number 81.
Seed number 14 corresponds to soil number 14.
Seed number 55 corresponds to soil number 57.
Seed number 13 corresponds to soil number 13.
The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed. Using these maps, find the lowest location number that corresponds to any of the initial seeds. To do this, you'll need to convert each seed number through other categories until you can find its corresponding location number. In this example, the corresponding types are:

Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
So, the lowest location number in this example is 35.

What is the lowest location number that corresponds to any of the initial seed numbers?
*/

const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.resolve('../Inputs/', 'input5.txt'), 'utf8').split('\n').filter(e => e !== '');

const test = 'seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4'.split('\n').filter(e => e !== '');

const findMap = (ranges, currMaps, counted) => {
    let result = [];
    const [dest, src, len] = ranges.map(e => Number(e));

    for (let i = 0; i < currMaps.length; i++) {
        if (src <= currMaps[i] && currMaps[i] <= src + len - 1 && !counted[i]) {
            result.push(dest + currMaps[i] - src);
            counted[i] = 1;
        } else {
            result.push(currMaps[i]);
        }
    }

    return result;
}

// console.log(findMap(['52', '50', '48'], [ '79', '14', '55', '13' ]))

const findLowestLocation = (almanac) => {
    let result = almanac[0].split(': ')[1].split(' ').map(e => Number(e));
    let counted = {};

    for (let i = 2; i < almanac.length; i++) {
        if (/[0-9]/.test(almanac[i][0])) {
            const ranges = almanac[i].split(' ');
            result = findMap(ranges, result, counted);
        } else {
            counted = [];
        }
    }
    // split to get map name, source, destination, length
    // then find its mapping, change result array to new mapping, then concinue to next mapping
    //      [0] - Dest                    [2] - Source            [1] - Len
    // if source <= currSource < source + length - 1 then dest + (currSource - cource)

    return Math.min(...result);
}

// console.log(findLowestLocation(input)); // 551761867

/*
--- Part Two ---
Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

seeds: 79 14 55 13
This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?
*/

const getSeedRanges = (seeds) => {
    let seedRanges = [];

    for (let i = 0; i < seeds.length; i += 2) {
        let start = seeds[i], end = start + seeds[i + 1] - 1;
        seedRanges.push([start, end]);
    }

    return seedRanges;
}

// console.log(getSeedRanges([79, 14, 55, 13]))

const findMap2 = (range, currMaps, counted) => {
    let result = [];
    const [dest, src, len] = range.map(e => Number(e));

    for (let i = 0; i < currMaps.length; i++) {
        /*
            1. find if seeds range fits in src range
                if yes -> calc new range then calc dest range
                if no -> keep original seed range

            * End goal, have an array of ranges, find the min of all the ranges then find the min of those numbers;
        */
        const [start, end] = currMaps[i];
        const [srcStart, srcEnd] = [src, src + len - 1];
        const [destStart, destEnd] = [dest, dest + len - 1];

        if (start >= srcStart && end <= srcEnd && !counted[i]) {
            let newStart = srcStart > start ? srcStart : start;
            let newEnd = srcEnd < end ? srcEnd : end;
            let newRange = [destStart - srcStart + newStart, destEnd - srcEnd + newEnd];
            // console.log({newStart, newEnd, srcStart, srcEnd, dest, newRange});
            // Somethings going on when converting to temp?
            // might be before temp in light?
            result.push(newRange);
            counted[i] = 1;
        } else {
            result.push(currMaps[i]);
        }

        // if (src <= currMaps[i] && currMaps[i] <= src + len - 1 && !counted[i]) {
        //     result.push(dest + currMaps[i] - src);
        //     counted[i] = 1;
        // } else {
        //     result.push(currMaps[i]);
        // }
    }

    return result;
}

// console.log(findMap(['52', '50', '48'], [ '79', '14', '55', '13' ]))

const findLowestLocation2 = (almanac) => {
    let result = almanac[0].split(': ')[1].split(' ').map(e => Number(e));
    result = getSeedRanges(result);
    let counted = {};

    for (let i = 2; i < almanac.length; i++) {
        if (/[0-9]/.test(almanac[i][0])) {
            const range = almanac[i].split(' ');
            result = findMap2(range, result, counted);

        } else {
            console.log(result);
            counted = [];
        }
    }

    return result;
}

console.log(findLowestLocation2(test)); //

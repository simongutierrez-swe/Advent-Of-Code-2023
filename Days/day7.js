/* eslint-disable complexity */
/*
--- Day 7: Camel Cards ---
Your all-expenses-paid trip turns out to be a one-way, five-minute ride in an airship. (At least it's a cool airship!) It drops you off at the edge of a vast desert and descends back to Island Island.

"Did you bring the parts?"

You turn around to see an Elf completely covered in white clothing, wearing goggles, and riding a large camel.

"Did you bring the parts?" she asks again, louder this time. You aren't sure what parts she's looking for; you're here to figure out why the sand stopped.

"The parts! For the sand, yes! Come with me; I will show you." She beckons you onto the camel.

After riding a bit across the sands of Desert Island, you can see what look like very large rocks covering half of the horizon. The Elf explains that the rocks are all along the part of Desert Island that is directly above Island Island, making it hard to even get there. Normally, they use big machines to move the rocks and filter the sand, but the machines have broken down because Desert Island recently stopped receiving the parts they need to fix the machines.

You've already assumed it'll be your job to figure out why the parts stopped when she asks if you can help. You agree automatically.

Because the journey will take a few days, she offers to teach you the game of Camel Cards. Camel Cards is sort of similar to poker except it's designed to be easier to play while riding a camel.

In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456
Hands are primarily ordered based on type; for example, every full house is stronger than any three of a kind.

If two hands have the same type, a second ordering rule takes effect. Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the same label, however, then move on to considering the second card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.

So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger (and both hands have the same first and second card).

To play Camel Cards, you are given a list of hands and their corresponding bid (your puzzle input). For example:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
This example shows five hands; each hand is followed by its bid amount. Each hand wins an amount equal to its bid multiplied by its rank, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.

So, the first step is to put the hands in order of strength:

32T3K is the only one pair and the other hands are all a stronger type, so it gets rank 1.
KK677 and KTJJT are both two pair. Their first cards both have the same label, but the second card of KK677 is stronger (K vs T), so KTJJT gets rank 2 and KK677 gets rank 3.
T55J5 and QQQJA are both three of a kind. QQQJA has a stronger first card, so it gets rank 5 and T55J5 gets rank 4.
Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5). So the total winnings in this example are 6440.

Find the rank of every hand in your set. What are the total winnings?
*/

// create your own sort function (ascending order), then map each el to e = e * index, then reduce to the sum of all elems

const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.resolve('../Inputs/', 'input7.txt'), 'utf8').split('\n').filter(e => e !== '')
.map(e => e.split(' '));
const test = '32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483'.split('\n').filter(e => e !== '').map(e => e.split(' '));

// give each card a weight for comparing
const cardBank = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
}

const combos = ['high card', 'one pair', 'two pair', 'three of a kind', 'full house', 'four of a kind', 'five of a kind'];

// now make a function that maps a hand to a combo and return its idx in combos, this will be its weight;
const mapHandToCombo = (hand) => {
    let counts = {};

    for (let i = 0; i < hand.length; i++) counts[hand[i]] ? counts[hand[i]]++ : counts[hand[i]] = 1;

    const vals = Object.values(counts), max = Math.max(...Object.values(counts));

    if (vals.length === 1) {
        return combos.length - 1;
    } else if (vals.length === 2) {
        return max === 4 ? combos.length - 2 : combos.length - 3;
    } else if (vals.length === 3) {
        return max === 3 ? combos.length - 4 : combos.length - 5;
    } else {
        return max === 2 ? combos.length - 6 : combos.length - 7;
    }
}

// console.log(mapHandToCombo('76891')); // 0

// Create a function that will compare hands that map to the same combo to see which one is greater;
const compareSameHand = (hand1, hand2) => {
    if (hand1 === hand2) return 'both are equal';

    for (let i = 0; i < hand1.length; i++) {
        if (cardBank[hand1[i]] > cardBank[hand2[i]]) {
            return hand1;
        } else if (cardBank[hand1[i]] < cardBank[hand2[i]]) {
            return hand2;
        }
    }
}

// console.log(compareSameHand('KK677', 'KTJJT')) // KK677

// compare the two hands following the rules described above and return that hand
const findBetterHand = (hand1, hand2) => {
    const combo1 = mapHandToCombo(hand1);
    const combo2 = mapHandToCombo(hand2);

    if (combo1 === combo2) {
        return compareSameHand(hand1, hand2);
    }

    return combo1 > combo2 ? hand1 : hand2;
}

// console.log(findBetterHand('KK677', 'KTJJT')) // KK677

const findTotalWinnings = (cards) => {
    // sorted in ascending order
    return cards.sort((hand1, hand2) => {
        if (findBetterHand(hand1[0], hand2[0]) === hand1[0]) {
            return 1 // [hand2, hand1]
        } else if (findBetterHand(hand1[0], hand2[0]) === hand2[0]) {
            return -1 // [hand1, hand2]
        } else {
            return 0; // keep the same pos
        }
    }).reduce((sum, elem, idx) => {
        // add upp all of the vals of each hand, * by idx bc thats its weight
        return sum + (Number(elem[1]) * (idx + 1));
    }, 0);
    }

console.log(findTotalWinnings(input)) // 251106089


/**
 * --- Part Two ---
To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
KK677 is now the only two pair, making it the second-weakest hand.
T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.
With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?
 */

// if J do some calc where the hand is moved to next best ffjkk


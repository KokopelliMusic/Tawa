package com.nierot.tawa;

import java.util.Arrays;

public class Util {

    private static final char[] LETTERS = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'M', 'O', 'P', 'Q'};

    /**
     * Generate a random string of given length
     * Takes its letters from {@link #LETTERS}
     * @param length The length of the random string
     * @return string of given length
     */
    public static String generateRandomString(int length) {
        StringBuilder str = new StringBuilder();
        for (int i = 0; i < length; i++) {
            str.append(LETTERS[Util.randomInt(0, LETTERS.length)]);
        }
        return str.toString();
    }

    /**
     * Generate a random int between lower and upper
     * @param lower The lower bound (inclusive)
     * @param upper The upper bound (inclusive)
     */
    public static int randomInt(int lower, int upper) {
        return (int) (Math.random() * (upper - lower)) + lower;
    }
}

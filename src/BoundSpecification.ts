/**
 * Simple interface describing a bound specification
 * used in the configuration file.
 * 
 * @see [[Configuration]] for further details.
 */
export interface BoundSpecification {
    /**
     * Lower bound, may also be negativ.
     * 
     * **Must be <= [[upperBound]]**.
     */
    lowerBound: number,
    /**
     * Upper bound, usually positive.
     * 
     * **Must be >= [[lowerBound]]**.
     */
    upperBound: number
}
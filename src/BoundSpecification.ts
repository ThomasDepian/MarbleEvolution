/**
 * Simple interface describing the bound specification
 * used in the configuration file.
 * 
 * @see [[Configuration]]
 */
export interface BoundSpecification {
    /**
     * Lower bound, may also be negativ.
     */
    lowerBound: number,
    /**
     * Upper bound, usually positive.
     */
    upperBound: number
}
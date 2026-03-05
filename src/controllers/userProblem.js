const {getLanguageById,submitBatch,submitToken }= require('../utils/problemutility');
const Problem = require('../Models/problem');



const createProblem = async (req,res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution
    } = req.body;

    try {

        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            

            const submissions = visibleTestCases.map((testcase) => ({
                source_code:completeCode,
                language_id:languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value) => value.token);

            const testResult = await submitToken(resultToken); // ✅ added await

            for (const test of testResult) {
                if (test.status_id!= 3) {
                    return res.status(400).send("Error Occurred in Test Cases");
                }
            }
        }

        await Problem.create({
            ...req.body,
            problemCreator: req.user?._id  // safer
        });

        res.status(201).send("Problem Saved Successfully");

    } catch (err) {
        res.status(400).send("Error: " + err.message); // ✅ fixed
    }
};

const UpdateProblem = async (req,res)=>{

}
module.exports = {createProblem,UpdateProblem};
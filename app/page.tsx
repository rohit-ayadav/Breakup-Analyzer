"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaPrint } from 'react-icons/fa';
import { PieChart } from 'react-minimal-pie-chart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const questions = [
    {
        id: 'communication',
        text: 'How would you rate your communication with your partner?',
        type: 'select',
        options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
    },
    {
        id: 'trust',
        text: 'Do you trust your partner completely?',
        type: 'radio',
        options: ['Yes', 'No', 'Not Sure']
    },
    {
        id: 'interests',
        text: 'What common interests do you share? (Select all that apply)',
        type: 'checkbox',
        options: ['Travel', 'Movies', 'Sports', 'Food', 'Music', 'Art', 'Other']
    },
    {
        id: 'shared_values',
        text: 'Do you and your partner share the same values?',
        type: 'radio',
        options: ['Yes', 'No', 'Not Sure']
    },
    {
        id: 'time_together',
        text: 'How much quality time do you spend together weekly?',
        type: 'select',
        options: ['Every day', 'Several times a week', 'Once a week', 'Rarely']
    },
    {
        id: 'emotional_support',
        text: 'Do you feel emotionally supported by your partner?',
        type: 'radio',
        options: ['Yes', 'No', 'Sometimes']
    },
    {
        id: 'conflict_resolution',
        text: 'How often do you and your partner resolve conflicts amicably?',
        type: 'select',
        options: ['Always', 'Most of the time', 'Sometimes', 'Rarely', 'Never']
    },
];

const BreakupAnalysis = () => {
    const [currentStep, setCurrentStep] = useState(-1);
    const [partnerMessage, setPartnerMessage] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker
                    .register('/sw.js', { scope: '/' })
                    .then(function (registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function (err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
    }, []);
    interface AnswersType {
        communication?: string;
        trust?: string;
        interests?: string[];
        shared_values?: string;
        time_together?: string;
        emotional_support?: string;
        conflict_resolution?: string;
    }

    const [answers, setAnswers] = useState<AnswersType>({});
    interface ResultType {
        score: number;
        prediction: string;
        description: string;
        tips: string[];
    }

    const [result, setResult] = useState<ResultType | null>(null);
    const [partnerName, setPartnerName] = useState('');
    const [yourName, setYourName] = useState('');

    const handleAnswer = (id: string, value: any) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const calculateScore = () => {
        let score = 0;
        const answerValues: { [key: string]: any } = {
            communication: { Excellent: 20, Good: 15, Average: 10, Poor: 5, 'Very Poor': 0 },
            trust: { Yes: 20, 'Not Sure': 10, No: 0 },
            interests: (answers['interests'] || []).length * 3,
            shared_values: { Yes: 15, 'Not Sure': 7, No: 0 },
            time_together: { 'Every day': 15, 'Several times a week': 10, 'Once a week': 5, Rarely: 0 },
            emotional_support: { Yes: 15, Sometimes: 7, No: 0 },
            conflict_resolution: { Always: 15, 'Most of the time': 12, Sometimes: 8, Rarely: 4, Never: 0 }
        };

        Object.keys(answers).forEach(key => {
            if (typeof answerValues[key as keyof typeof answerValues] === 'object') {
                const answerValue = answers[key as keyof AnswersType];
                if (Array.isArray(answerValue)) {
                    score += answerValue.length * 3;
                } else if (answerValue !== undefined) {
                    score += (answerValues[key as keyof typeof answerValues] as any)[answerValue] || 0;
                }
            } else {
                const answerValue = answers[key as keyof AnswersType];
                if (typeof answerValues[key as keyof typeof answerValues] === 'number') {
                    score += answerValues[key as keyof typeof answerValues] as number;
                } else if (typeof answerValue === 'string' && typeof answerValues[key as keyof typeof answerValues] === 'object' && answerValues[key as keyof typeof answerValues][answerValue] !== undefined) {
                    score += (answerValues[key as keyof typeof answerValues] as any)[answerValue];
                }
            }
        });

        return Math.min((score / 115) * 100, 100);
    };

    const getResult = (score: number) => {
        if (score > 90) {
            return {
                prediction: `Congratulations, ${yourName} and ${partnerName}! Your relationship is predicted to be exceptionally strong and lasting.`,
                description: "You've built a solid foundation of trust, communication, and shared interests. Your bond appears to be deeply rooted in mutual understanding and respect.",
                tips: [
                    "Continue to nurture your strong communication skills",
                    "Support each other's personal growth and aspirations",
                    "Regularly express gratitude and appreciation for each other",
                    "Plan for the future together, setting shared goals and dreams"
                ]
            };
        } else if (score > 75) {
            return {
                prediction: `${yourName} and ${partnerName}, your relationship shows great potential and strength.`,
                description: "You have a healthy foundation, but there's always room for growth. Focus on the areas where you can improve to make your bond even stronger.",
                tips: [
                    "Work on resolving conflicts more effectively",
                    "Spend more quality time together engaging in shared interests",
                    "Practice active listening to understand each other better",
                    "Discuss your long-term goals and ensure they align"
                ]
            };
        } else if (score > 60) {
            return {
                prediction: `${yourName} and ${partnerName}, your relationship is at a crucial stage that requires attention and effort.`,
                description: "While there are positive aspects to your relationship, there are also areas that need significant improvement. It's important to address these issues together.",
                tips: [
                    "Improve your communication skills, especially during conflicts",
                    "Work on building trust through transparency and consistency",
                    "Find new shared interests or activities to enjoy together",
                    "Consider relationship counseling to address underlying issues"
                ]
            };
        } else if (score > 40) {
            return {
                prediction: `${yourName} and ${partnerName}, your relationship is facing some serious challenges.`,
                description: "There are significant areas of concern in your relationship that need immediate attention. It's crucial to have honest conversations about your future together.",
                tips: [
                    "Have an open and honest conversation about your relationship concerns",
                    "Identify the root causes of trust issues and work on rebuilding trust",
                    "Improve your conflict resolution skills through counseling or workshops",
                    "Reassess your individual needs and relationship goals"
                ]
            };
        } else {
            return {
                prediction: `${yourName} and ${partnerName}, your relationship is at a critical juncture.`,
                description: "The current state of your relationship indicates major incompatibilities or unresolved issues. It's time for serious reflection on whether this relationship is meeting both of your needs.",
                tips: [
                    "Engage in individual self-reflection about your needs and desires in a relationship",
                    "Consider seeking professional help to navigate this difficult period",
                    "Have a frank discussion about the future of your relationship",
                    "If you decide to part ways, aim to do so with mutual respect and understanding"
                ]
            };
        }
    };

    const handleSubmit = () => {
        const score = calculateScore();
        const resultData = getResult(score);
        setResult({ score, ...resultData } as any);
        setCurrentStep(questions.length);
    };

    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'select':
                return (
                    <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        value={answers[question.id as keyof typeof answers] || ''}
                    >
                        <option value="">Select an option</option>
                        {question.options.map((option: any) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className="space-y-2">
                        {question.options.map((option: string) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={answers[question.id as keyof typeof answers] === option}
                                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                                    className="form-radio"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {question.options.map((option: string) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={(answers[question.id as keyof typeof answers] || []).includes(option)}
                                    onChange={(e) => {
                                        const currentValues = answers[question.id as keyof typeof answers] || [];
                                        const newValues = e.target.checked
                                            ? [...(currentValues as string[]), option]
                                            : (currentValues as string[]).filter((v: any) => v !== option);
                                        handleAnswer(question.id, newValues);
                                    }}
                                    className="form-checkbox"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const handleStart = () => {
        if (!yourName.trim()) {
            toast.error('Apna naam to daal de bhai');
            return;
        }
        if (!partnerName.trim()) {
            toast.error('Partner ka naam to daalana padega');
            setPartnerMessage(true);
            return
        }
        setCurrentStep(0);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Relationship Analysis',
                text: `Check out my relationship analysis with ${partnerName}! Our score: ${result?.score.toFixed(2)}%`,
                url: window.location.href
            }).then(() => {
                toast.success('Shared successfully!');
            }).catch(() => {
                toast.error('Error sharing');
            });
        } else {
            toast.info('Sharing is not supported on this device');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-purple-100">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <FaHeart className="text-pink-500 text-2xl mr-2" />
                        <span className="font-bold text-xl text-gray-800">Relationship Analyzer</span>
                    </div>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="text-gray-600 hover:text-gray-800">Home</a></li>
                        <li><a href="https://resourcesandcarrier.online/#about" className="text-gray-600 hover:text-gray-800">About</a></li>
                        <li><a href="https://resourcesandcarrier.online/contact" className="text-gray-600 hover:text-gray-800">Contact</a></li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Analyze Your Relationship</h1>

                {currentStep === -1 ? (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter Your Names</h2>
                        <input
                            type="text"
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Your name"
                            required
                        />
                        <input
                            type="text"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Partner's name"
                            required
                        />
                        {partnerMessage && <p className="text-grey-500 text-sm mb-4">I have no database 😜, so don't worry about privacy</p>}
                        <button
                            onClick={handleStart}
                            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 w-full transition duration-300"
                        >
                            Start Analysis
                        </button>
                    </div>
                ) : currentStep < questions.length ? (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{questions[currentStep].text}</h2>
                        {renderQuestion(questions[currentStep])}
                        <div className="mt-6 flex justify-between">
                            {currentStep > 0 && (
                                <button
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-300"
                                >
                                    Previous
                                </button>
                            )}
                            <button
                                onClick={() => currentStep === questions.length - 1 ? handleSubmit() : setCurrentStep(prev => prev + 1)}
                                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 ml-auto transition duration-300"
                            >
                                {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : result && (
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Your Relationship Analysis</h2>
                        <div className="mb-6 flex justify-center">
                            <div className="w-64 h-64">
                                <PieChart
                                    data={[{ value: result?.score, color: '#F472B6' }]}
                                    reveal={result?.score}
                                    lineWidth={20}
                                    background="#F3F4F6"
                                    lengthAngle={360}
                                    rounded
                                    animate
                                    label={({ dataEntry }) => `${Math.round(dataEntry.value)}%`}
                                    labelStyle={{
                                        fontSize: '25px',
                                        fontFamily: 'sans-serif',
                                        fill: '#374151',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-left mb-6">
                            <p className="text-2xl font-bold text-pink-500 mb-4">{result?.prediction}</p>
                            <p className="text-lg text-gray-600 mb-4">{result?.description}</p>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Relationship Tips</h3>
                            <ul className="list-disc list-inside text-left">
                                {result?.tips.map((tip: any, index: number) => (
                                    <li key={index} className="text-gray-600 mb-2">{tip}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-8 flex justify-center space-x-4">
                            <p className="text-gray-600">Remember, this analysis is just for fun. Real relationships require ongoing effort, communication, and understanding.</p>

                        </div>
                        <div className="mt-8 flex justify-center space-x-4">
                            {/* btn in same theme for share and print */}
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition duration-300"
                            >
                                {/* <FaShareAlt className="mr-2" />  */}
                                Share Result with Partner
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition duration-300"
                            >
                                {/* <FaPrint className="mr-2" />  */}
                                Print Result for Future Reference
                            </button>

                        </div>
                    </div>
                )}
            </main>
            <footer className="bg-white text-center text-sm text-gray-600 py-4">
                Presented with 🩷 by{' '}
                <a href="https://resourcesandcarrier.online" className="font-semibold hover:underline">Resources and Updates</a>
            </footer>
        </div>
    );
}


export default BreakupAnalysis;
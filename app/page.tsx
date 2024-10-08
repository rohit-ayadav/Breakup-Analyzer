"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import { FaHeart, FaHeartBroken, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { PieChart } from 'react-minimal-pie-chart';

const BreakupAnalysis = () => {
    const [currentStep, setCurrentStep] = useState(-1);
    const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [result, setResult] = useState<{
        prediction: ReactNode; score: number; tips?: ReactNode
    } | null>(null);
    const [partnerName, setPartnerName] = useState<string>('');
    const [yourName, setYourName] = useState<string>('');

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

    const handleAnswer = (id: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = () => {

        let score = 0;


        if (answers.communication === 'Excellent') score += 20;
        else if (answers.communication === 'Good') score += 15;
        else if (answers.communication === 'Average') score += 10;
        else score += 5;

        if (answers.trust === 'Yes') score += 20;
        else if (answers.trust === 'Not Sure') score += 10;

        if (answers.interests && answers.interests.length > 3) score += 15;
        else score += 5;

        if (answers.conflict_resolution === 'Always' || answers.conflict_resolution === 'Most of the time') score += 15;
        else if (answers.conflict_resolution === 'Sometimes') score += 10;


        score = Math.min((score / 70) * 100, 100);

        let prediction, tips;
        if (score > 90) {
            prediction = (
                <div>
                    <p>Your relationship is predicted to be <span className="text-pink-500 font-bold">strong and lasting</span>.</p>
                    <p>You've built a solid foundation of trust, communication, and shared interests. Keep nurturing this bond.</p>
                </div>
            );
            tips = (
                <ul>
                    <li>Keep communicating openly and honestly.</li>
                    <li>Support each other’s personal growth.</li>
                    <li>Make time for shared activities and quality moments.</li>
                </ul>
            );
        } else if (score > 70) {
            prediction = (
                <div>
                    <p>Your relationship is predicted to be <span className="text-pink-500 font-bold">healthy but with areas to improve</span>.</p>
                    <p>You have a strong bond, but some areas could use more attention.</p>
                </div>
            );
            tips = (
                <ul>
                    <li>Work on resolving small issues before they grow.</li>
                    <li>Practice active listening to understand each other better.</li>
                    <li>Spend more time together doing activities you both enjoy.</li>
                </ul>
            );
        } else if (score > 50) {
            prediction = (
                <div>
                    <p>Your relationship is predicted to be <span className="text-pink-500 font-bold">in a critical phase</span>.</p>
                    <p>There may be some growing concerns, like communication breakdowns or mismatched goals.</p>
                </div>
            );
            tips = (
                <ul>
                    <li>Have open and honest conversations about your concerns.</li>
                    <li>Consider relationship counseling if needed.</li>
                    <li>Focus on rebuilding trust and understanding.</li>
                </ul>
            );
        } else if (score > 30) {
            prediction = (
                <div>
                    <p>Your relationship is predicted to be <span className="text-pink-500 font-bold">at risk of becoming short-term</span>.</p>
                    <p>You might be facing significant challenges in maintaining connection or trust.</p>
                </div>
            );
            tips = (
                <ul>
                    <li>Identify whether your long-term goals still align.</li>
                    <li>Work on improving trust and openness.</li>
                    <li>Consider if both of you are equally committed to making this relationship work.</li>
                </ul>
            );
        } else {
            prediction = (
                <div>
                    <p>Your relationship is predicted to be <span className="text-pink-500 font-bold">unlikely to last</span>.</p>
                    <p>There may be major differences or challenges that make long-term compatibility difficult.</p>
                </div>
            );
            tips = (
                <ul>
                    <li>Reflect on whether this relationship is bringing you happiness.</li>
                    <li>Have a candid conversation about your future together.</li>
                    <li>Consider parting ways if it's in the best interest of both partners.</li>
                </ul>
            );
        }

        setResult({ score, prediction, tips });
        setCurrentStep(questions.length);
    };



    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'select':
                return (
                    <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {question.options.map((option: string) => (
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
                                    onChange={(e) => handleAnswer(question.id, e.target.value)}
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
                                    onChange={(e) => {
                                        const currentValues: string[] = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];
                                        if (e.target.checked) {
                                            handleAnswer(question.id, [...currentValues, option]);
                                        } else {
                                            handleAnswer(question.id, currentValues.filter((v: string) => v !== option));
                                        }
                                    }}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'textarea':
                return (
                    <textarea
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                    ></textarea>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-purple-100">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <FaHeart className="text-pink-500 text-2xl mr-2" />
                        <span className="font-bold text-xl text-gray-800">Relationship Analyzer</span>
                    </div>
                    <ul className="flex space-x-4">
                        <li><a href="/breakup-analyzer" className="text-gray-600 hover:text-gray-800">Home</a></li>
                        <li><a href="/#about" className="text-gray-600 hover:text-gray-800">About</a></li>
                        <li><a href="/feedback" className="text-gray-600 hover:text-gray-800">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Analyze Your Relationship</h1>

                {currentStep === -1 ? (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter Your Name</h2>
                        <input
                            type="text"
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Your name"
                        />
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter Your Partner's Name</h2>
                        <input
                            type="text"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Partner's name"
                        />
                        <button
                            onClick={() => setCurrentStep(0)}
                            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 w-full"
                            disabled={!partnerName.trim()}
                        >

                            Analyze My Relationship
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
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Previous
                                </button>
                            )}
                            <button
                                onClick={() => currentStep === questions.length - 1 ? handleSubmit() : setCurrentStep(prev => prev + 1)}
                                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 ml-auto"
                            >
                                {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : result && (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Relationship Analysis</h2>
                        <div className="mb-6">
                            <PieChart
                                data={[{ value: result.score, color: '#F472B6' }]}
                                reveal={result.score}
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
                        <p className="text-xl mb-4">Your relationship is predicted to be:</p>

                        <p className="text-3xl font-bold text-pink-500 mb-6 text-left">{result.prediction}</p>
                        {/* <p className="text-3xl font-bold text-pink-500 mb-6">{result.tips}</p> */}

                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Relationship Tips</h3>
                            <ul className="list-inside text-left">
                                {
                                    <li className="text-gray-600 mb-2">{result.tips}</li>
                                }
                            </ul>
                        </div>
                        <br /><br /><br />
                        <hr />
                        <p className="text-gray-600">Remember, this analysis is just for fun. Real relationships require ongoing effort, communication, and understanding.</p>
                    </div>
                )}
            </main>


            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="w-full md:w-1/3 text-center md:text-left">
                            <h3 className="text-lg font-semibold mb-2">Relationship Analyzer</h3>
                            <p className="text-sm">Analyzing relationships since Sep 2024</p>
                        </div>
                        <div className="w-full md:w-1/3 text-center mt-4 md:mt-0">
                            <h4 className="text-lg font-semibold mb-2">Connect with us</h4>
                            <div className="flex justify-center space-x-4">
                                <a href="/" className="hover:text-pink-400"><FaFacebook size={24} /></a>
                                <a href="/" className="hover:text-pink-400"><FaTwitter size={24} /></a>
                                <a href="/" className="hover:text-pink-400"><FaInstagram size={24} /></a>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-0">
                            <p className="text-sm">&copy; 2023 Relationship Analyzer. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BreakupAnalysis;
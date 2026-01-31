import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SDP 3 Backend API',
            version: '1.0.0',
            description: 'API documentation for the SDP 3 Backend application',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'user_id', 'email', 'role', 'passwordHash'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the user',
                        },
                        user_id: {
                            type: 'string',
                            description: 'Unique user identifier (e.g., Student ID)',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'teacher', 'admin', 'mod'],
                            default: 'student',
                            description: 'User role',
                        },
                        dept: {
                            type: 'string',
                            description: 'Department name',
                        },
                        intake: {
                            type: 'string',
                            description: 'Intake batch',
                        },
                        section: {
                            type: 'string',
                            description: 'Section',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    },
                },
                Suggestion: {
                    type: 'object',
                    required: ['course_code', 'course_name', 'dept', 'exam_type', 'uploaded_by'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        course_code: {
                            type: 'string',
                            description: 'Course Code (e.g., CSE-101)',
                        },
                        course_name: {
                            type: 'string',
                            description: 'Title of the course',
                        },
                        dept: {
                            type: 'string',
                            description: 'Department',
                        },
                        intake: {
                            type: 'string',
                            description: 'Intake batch',
                        },
                        section: {
                            type: 'string',
                            description: 'Section',
                        },
                        exam_type: {
                            type: 'string',
                            enum: ['Midterm', 'Final'],
                            description: 'Type of exam',
                        },
                        description: {
                            type: 'string',
                            description: 'Additional details',
                        },
                        attachment_url: {
                            type: 'string',
                            description: 'URL to the uploaded file',
                        },
                        stars: {
                            type: 'number',
                            description: 'Rating of the suggestion',
                            minimum: 0,
                            maximum: 5,
                        },
                        uploaded_by: {
                            type: 'string',
                            description: 'User ID of the uploader',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    },
                },
                SubscriptionPlan: {
                    type: 'object',
                    required: ['name', 'price', 'durationInDays', 'downloadLimit'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the plan (e.g., Basic, Premium)',
                        },
                        price: {
                            type: 'number',
                            description: 'Price of the plan',
                        },
                        durationInDays: {
                            type: 'number',
                            description: 'Duration in days',
                        },
                        downloadLimit: {
                            type: 'number',
                            description: 'Maximum downloads allowed',
                        },
                        features: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'List of features included',
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Is the plan active',
                        }
                    }
                },
                Subscription: {
                    type: 'object',
                    required: ['user', 'plan', 'endDate'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID',
                        },
                        plan: {
                            type: 'string',
                            description: 'Subscription Plan ID',
                        },
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Start date of subscription',
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'End date of subscription',
                        },
                        downloadsUsed: {
                            type: 'number',
                            description: 'Number of downloads used',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'expired', 'cancelled'],
                            description: 'Subscription status',
                        }
                    }
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

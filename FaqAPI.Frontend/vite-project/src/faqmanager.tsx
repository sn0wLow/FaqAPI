import { useState } from 'react';
import { Button, Modal, Form, Badge} from 'react-bootstrap';
import { QuestionDTO } from './ts/interfaces/QuestionDTO';
import { Faq } from './ts/interfaces/Faq';


interface FAQManagerProps 
{
    addFaqCallback: (newFaq: Faq) => void;
}
  
const FAQManager: React.FC<FAQManagerProps> = ({ addFaqCallback }) =>
{
    const [showModal, setShowModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [validated, setValidated] = useState(false);


    const addTag = () => 
        {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => 
        {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => 
    {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        if (event.currentTarget.checkValidity()) 
        {
            handleSave();
        }
    };

    const handleOpen = () => 
    {
        setShowModal(true);
        setValidated(false);
    };

    const handleClose = () => 
    {
        setShowModal(false);
        setValidated(false);
        setTags([]);
    };

    const handleSave = async () => 
    {
        const questionDTO: QuestionDTO = {
            id: 0,
            question: question,
            answer: answer,
            tags: tags.length > 0 ? tags : []
        };

        try 
        {
            const response = await fetch('https://localhost:7256/api/Faq/Create', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionDTO),
            });

            if (!response.ok) 
            {
                throw new Error('Failed to create FAQ');
            }

            const createdFaq: Faq = await response.json();
            addFaqCallback(createdFaq);

            handleClose();
        } 
        catch (error) 
        {
            console.error("Failed to fetch FAQ", error);
        }

        handleClose();
    };



    return (
    <div>
        <Button variant='info' className='w-100' onClick={handleOpen}>
            <i className="fa-solid fa-plus me-2"></i>Add new FAQs
        </Button>

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New FAQ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} id='faqForm'>
                    <Form.Group className="mb-3" controlId="faqQuestion">
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter Question"
                            isInvalid={validated && !question}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid question.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="faqAnswer">
                        <Form.Control
                            required
                            as="textarea"
                            placeholder="Enter Answer"
                            isInvalid={validated && !answer}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid answer.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="faqTags">
                        <Form.Label>Tags</Form.Label>
                        <div className="d-flex">
                            <Form.Control type="text" placeholder="Add tag" className='me-2'
                                          value={tagInput} onChange={e => setTagInput(e.target.value)} />
                            <Button variant="primary" onClick={addTag} style={{whiteSpace: 'nowrap'}}>Add Tag</Button>
                        </div>

                        <div className="mt-2">
                            {tags.map((tag, index) => (
                                <Badge key={index} bg="secondary" className="me-2" onClick={() => removeTag(tag)}>
                                    {tag} <span style={{ cursor: 'pointer' }}>×</span>
                                </Badge>
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="success" type="submit" form="faqForm">
                    Add FAQ
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
    );
}

export default FAQManager;

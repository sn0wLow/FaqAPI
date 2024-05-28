
import './App.css'
import React, { useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import { Faq } from './ts/interfaces/Faq';
import FAQManager from './faqmanager'


import { Container, Row, Col, Button, FormControl, InputGroup, Placeholder } from 'react-bootstrap';


const fetcher: Fetcher<Faq[], string> = (url: string) => fetch(url).then(res => res.json());

function truncateText(text: string, maxLength: number): string 
{
  if (text.length <= maxLength)
  {
    return text;
  }

  const lastSpaceIndex = text.slice(0, maxLength).lastIndexOf(" ");
  if (lastSpaceIndex === -1)
  {
    return text.slice(0, maxLength) + '..';
  }

  return text.slice(0, lastSpaceIndex) + '..';
}

function App() 
{

  const { data, error, isLoading, mutate } = useSWR<Faq[]>('https://localhost:7256/api/Faq/GetAll', fetcher);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const updateFaqs = (newFaq: Faq) => 
  {
    if (data) {
      const updatedFaqs = [...data, newFaq];
      mutate(updatedFaqs, false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => 
  {
    setSearchTerm(e.target.value);
  };

  const filteredFaqs = data?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  if (isLoading)
  {
    return (
      <>
        <FaqHeader />
        <FaqSkeleton />
      </>
    );
  }

  if (!data || error) 
  {
    return (
      <>
        <FaqHeader />
        <h2 className="mt-3">Failed to load FAQs</h2>
      </>
    );
  }

  if (data.length === 0)
  {
    return (
      <>
        <FaqHeader />
        <h2 className="mt-3">Currently no FAQs exist</h2>
      </>
    );
  }

  if (filteredFaqs.length === 0)
  {
    return (
      <>
        <FaqHeader />
        <SearchBar searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange}/>

        <h3 className="mt-3">Your filter did not find any items.</h3>
      </>
    );

  }

  return (
    <>
      <FaqHeader />

    <Container className='my-3 px-0'>
      <Row className="justify-content-center align-items-center">
        <Col sm={12} md={4}>
          <FAQManager addFaqCallback={updateFaqs} /> 
        </Col>
      </Row>
    </Container>




      <SearchBar searchTerm={searchTerm} 
                 handleSearchChange={handleSearchChange}/>

      <Container className="my-3 px-0 faq-grid">
        {filteredFaqs.map(faqs => (
          <div key={faqs.id}>
            <h2 className='text-info'>{faqs.question}</h2>
            <p>{truncateText(faqs.answer, 200)}</p>
          </div>
        ))}
    </Container>
    </>
  );


}

function FaqHeader() 
{
  return (
    <Container className='mt-5 px-3 py-3 border border-2 bg-secondary-subtle'>
      <h1>Frequent Questions</h1>
      <h6 className='mt-4'>Simple answers to your most common questions</h6>
      <Row className='mt-4'>
        <Col>
          <Button variant='success' className='w-100'>
            <i className="fa fa-book-open me-2"></i>Getting Started Guide
          </Button>
        </Col>
        <Col>
          <Button variant='primary' className='w-100'>
            <i className="fa fa-envelope me-2"></i>Email Support
          </Button>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Col sm={12} md={3}/>
        <Col sm={12} md={6}>
        </Col>
        <Col sm={12} md={3}/>
      </Row>

    </Container>
  );
}

function SearchBar({ searchTerm, handleSearchChange }: 
  { searchTerm: string, handleSearchChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <Container className='my-3 px-0'>
      <InputGroup>
        <InputGroup.Text>
          <i className="fas fa-search"></i>
        </InputGroup.Text>

         <FormControl
            type="text"
            placeholder="Search.."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
    </Container>
  );
}

function FaqSkeleton(){
  return (
    <Container className="my-3 px-0">
      <Row className="justify-content-center align-items-center">
        <Col sm={12} md={4}>
          <Placeholder animation="wave" as='button' xs='12' bg="info" style={{ height: '38px' }}>
            <Placeholder/>
          </Placeholder>
        </Col>
      </Row>

      <div className='my-3'>
        <Placeholder animation="wave" style={{ display: 'flex' }}>
            <Placeholder style={{ width: '100%', height: '38px' }} />
        </Placeholder>
      </div>


      <Container className="px-0 faq-grid">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="mb-3">
              <Placeholder as="h2" animation="wave">
                <Placeholder xs={8} />
              </Placeholder>

              <Placeholder as='p' animation="glow">
                <Placeholder xs={4} /> <Placeholder xs={7} /> <Placeholder xs={6} />{' '}
                <Placeholder xs={4} /> <Placeholder xs={5} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={7} />{' '} <Placeholder xs={4} />
              </Placeholder>
            </div>

        ))}
      </Container>
    </Container>

  );
}

export default App

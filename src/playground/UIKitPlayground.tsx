import React from 'react';
import {
  Button,
  Input,
  Textarea,
  Text,
  Checkbox,
  Select,
  Switch,
  Slider,
  Tag,
  Tabs,
  FormGroup,
  Form,
} from '@/design-system/components';

const UIKitPlayground: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [textarea, setTextarea] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState('');
  const [switchOn, setSwitchOn] = React.useState(true);
  const [sliderValue, setSliderValue] = React.useState(5);
  const [activeTab, setActiveTab] = React.useState('one');

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Text variant="h2">UIKit Playground</Text>

      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <FormGroup label="Email" htmlFor="email" helperText="We'll never share it." required>
          <Input
            id="email"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="you@example.com"
          />
        </FormGroup>

        <FormGroup label="Your Message" htmlFor="message">
          <Textarea
            id="message"
            value={textarea}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextarea(e.target.value)}
            placeholder="Start typing..."
          />
        </FormGroup>

        <FormGroup>
          <Checkbox label="Accept terms" checked={checked} onChange={setChecked} />
        </FormGroup>

        <FormGroup label="Choose an option">
          <Select
            value={selectValue}
            onChange={setSelectValue}
            options={[
              { label: 'Option 1', value: 'one' },
              { label: 'Option 2', value: 'two' },
              { label: 'Option 3', value: 'three' },
            ]}
            placeholder="Choose..."
          />
        </FormGroup>

        <FormGroup>
          <Switch checked={switchOn} onChange={setSwitchOn} label="Enable feature" />
        </FormGroup>

        <FormGroup label="Set energy level">
          <Slider
            min={0}
            max={10}
            value={sliderValue}
            onChange={(val: number) => setSliderValue(val)}
          />
        </FormGroup>

        <Button type="submit">Submit</Button>
      </Form>

      <div>
        <Text variant="h3">Tabs</Text>
        <Tabs
          tabs={[
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
        <Text style={{ marginTop: '1rem' }}>Active: {activeTab}</Text>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tag label="Creative" />
        <Tag label="Published" variant="success" />
        <Tag label="Draft" variant="warning" />
        <Tag label="Error" variant="error" />
      </div>
    </div>
  );
};

export default UIKitPlayground;

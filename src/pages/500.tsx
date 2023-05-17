import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/Jumbotron/Jumbotron';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

const Error = () => (
    <Jumbotron>
        <JumbotronTitle>Error</JumbotronTitle>
        <JumbotronBody>
            Sorry, something went wrong. Please try again later.
        </JumbotronBody>
        <ButtonGroup>
            <ButtonLink href="/" size="lg">
                Home
            </ButtonLink>
        </ButtonGroup>
    </Jumbotron>
);

Error.meta = {
    title: 'Error'
};

export default Error;

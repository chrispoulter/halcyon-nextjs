import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/Jumbotron/Jumbotron';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

const NotFound = () => (
    <Jumbotron>
        <JumbotronTitle>Not Found</JumbotronTitle>
        <JumbotronBody>
            Sorry, the resource you were looking for could not be found.
        </JumbotronBody>
        <ButtonGroup>
            <ButtonLink href="/" size="lg">
                Home
            </ButtonLink>
        </ButtonGroup>
    </Jumbotron>
);

NotFound.meta = {
    title: 'Not Found'
};

export default NotFound;

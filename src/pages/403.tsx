import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/Jumbotron/Jumbotron';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

const Forbidden = () => (
    <Jumbotron>
        <JumbotronTitle>Access Denied</JumbotronTitle>
        <JumbotronBody>
            Sorry, you do not have access to this resource.
        </JumbotronBody>
        <ButtonGroup>
            <ButtonLink href="/" size="lg">
                Home
            </ButtonLink>
        </ButtonGroup>
    </Jumbotron>
);

Forbidden.meta = {
    title: 'Access Denied'
};

export default Forbidden;

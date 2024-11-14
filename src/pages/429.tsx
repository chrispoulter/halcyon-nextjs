import { Meta } from '@/components/meta';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/jumbotron';
import { ButtonGroup } from '@/components/button-group';
import { ButtonLink } from '@/components/button-link';

const TooManyRequestsPage = () => (
    <>
        <Meta title="Too Many Requests" />

        <Jumbotron>
            <JumbotronTitle>Too Many Requests</JumbotronTitle>
            <JumbotronBody>
                Sorry, the server is currently experiencing a high load. Please
                try again later.
            </JumbotronBody>
            <ButtonGroup>
                <ButtonLink href="/" size="lg">
                    Home
                </ButtonLink>
            </ButtonGroup>
        </Jumbotron>
    </>
);

export default TooManyRequestsPage;

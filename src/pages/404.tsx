import { Meta } from '@/components/meta';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/jumbotron';
import { ButtonGroup } from '@/components/button-group';
import { ButtonLink } from '@/components/button-link';

const NotFoundPage = () => (
    <>
        <Meta title="Not Found" />

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
    </>
);

export default NotFoundPage;

import { Meta } from '@/components/Meta/Meta';
import {
    Jumbotron,
    JumbotronBody,
    JumbotronTitle
} from '@/components/Jumbotron/Jumbotron';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';

const ForbiddenPage = () => (
    <>
        <Meta title="Access Denied" />

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
    </>
);

export default ForbiddenPage;

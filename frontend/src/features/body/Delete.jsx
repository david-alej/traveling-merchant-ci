import { selectBody } from "./bodySlice.js"
import { useDeleteDataMutation } from "../../util/query-util.jsx"
import Spinner from "../../components/Spinner.jsx"
import Button from "../../components/Button.jsx"
import Row from "./Row.jsx"

import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { MdOutlineClear } from "react-icons/md"
import ApiResponse from "../../components/ApiResponse.jsx"

export default function Delete({ columns, data, closePopUp }) {
  const route = useLocation().pathname.split("/")[1]
  // eslint-disable-next-line no-unused-vars
  const { errors, requirements, ...body } = useSelector(selectBody)

  const [deleteData, { error: response, isLoading: isDeleting, isError }] =
    useDeleteDataMutation(route)

  let content

  if (isDeleting) {
    content = <Spinner />
  } else if (isError) {
    content = <ApiResponse response={response} />
  } else if (!data) {
    content = (
      <div className="delete">
        <ApiResponse
          response={{
            originalStatus: 404,
            data: `${route[0].toUpperCase() + route.slice(1, -1)} not found.`,
          }}
        />
      </div>
    )
  } else {
    content = (
      <>
        <div className="delete">
          <div className="delete-header">
            Are you sure you want to <strong>delete</strong> the following{" "}
            <strong>{route.slice(0, -1)}</strong>?
          </div>
          <div className="datum view-only" key={`${route}-${data.id}`}>
            {columns.map(({ accessorKey: property, header, cell }, index) => (
              <Row
                key={index}
                property={property}
                value={cell({ getValue: () => data[property] })}
                header={header}
              />
            ))}
          </div>
        </div>
        <br />
        <div className="delete-boolean-buttons">
          <Button className="delete-boolean-button" text="Yes" />
          <Button
            className="delete-boolean-button"
            type="button"
            text="No"
            onClick={closePopUp}
          />
        </div>
      </>
    )
  }

  return (
    <form
      className="pop-up"
      onSubmit={async (e) => {
        e.preventDefault()

        try {
          await deleteData(data.id)
        } catch (err) {
          console.log(err)
        }

        closePopUp()
      }}
    >
      <div className="pop-up-header">
        <strong>Delete</strong>
        <Button
          className="no-visibility-button"
          icon={<MdOutlineClear />}
          type="button"
          onClick={closePopUp}
        />
      </div>
      <br />
      {content}
      <br />
    </form>
  )
}

Delete.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  closePopUp: PropTypes.func.isRequired,
}
